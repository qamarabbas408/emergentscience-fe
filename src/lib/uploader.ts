import { apiClient } from './apiClient'

export interface UploadChunkOptions {
  file: File
  url: string
  chunkSize?: number
  concurrency?: number
  maxRetries?: number
  fieldName?: string
  headers?: Record<string, string>
  onProgress?: (percent: number, loaded: number, total: number) => void
}

const DEFAULT_CHUNK_SIZE = 1024 * 1024 // 1 MB
const DEFAULT_CONCURRENCY = 3
const DEFAULT_MAX_RETRIES = 3

export interface UploadedChunk {
  index: number
  loaded: boolean
}

export function createChunkId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

export function getChunksState(id: string): UploadedChunk[] | null {
  try {
    const raw = localStorage.getItem(`es_upload:${id}`)
    return raw ? (JSON.parse(raw) as UploadedChunk[]) : null
  } catch {
    return null
  }
}

export function saveChunksState(id: string, chunks: UploadedChunk[]) {
  localStorage.setItem(`es_upload:${id}`, JSON.stringify(chunks))
}

export function clearChunksState(id: string) {
  localStorage.removeItem(`es_upload:${id}`)
}

export async function uploadChunkedFile({
  file,
  url,
  chunkSize = DEFAULT_CHUNK_SIZE,
  concurrency = DEFAULT_CONCURRENCY,
  maxRetries = DEFAULT_MAX_RETRIES,
  fieldName = 'chunk',
  headers,
  onProgress,
}: UploadChunkOptions): Promise<void> {
  const totalChunks = Math.ceil(file.size / chunkSize)
  const id = createChunkId(file)
  const state = getChunksState(id) ?? Array.from({ length: totalChunks }, () => ({ index: 0, loaded: false }))
  let loadedBytes = state.filter((c) => c.loaded).length * chunkSize
  const reportedTotal = file.size || totalChunks

  const send = (index: number) => {
    const chunk = file.slice(index * chunkSize, Math.min((index + 1) * chunkSize, file.size))
    const form = new FormData()
    form.append(fieldName, chunk)
    form.append('chunkIndex', String(index))
    form.append('totalChunks', String(totalChunks))
    form.append('fileName', file.name)
    form.append('fileId', id)
    return apiClient.post(url, form, {
      headers,
      onUploadProgress: (e) => {
        if (e.total) {
          const delta = Math.max(0, e.loaded - (state[index]?.loaded ? chunk.size : 0))
          loadedBytes += delta
          onProgress?.(Math.min(99, Math.round((loadedBytes / reportedTotal) * 100)), loadedBytes, reportedTotal)
        }
      },
    })
  }

  const worker = async (index: number) => {
    if (state[index].loaded) return
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await send(index)
        state[index].loaded = true
        loadedBytes += chunkSize
        saveChunksState(id, state)
        return
      } catch (err) {
        if (attempt === maxRetries) throw err
        await new Promise((r) => setTimeout(r, 500 * 2 ** attempt))
      }
    }
  }

  let cursor = 0
  const queue: Promise<void>[] = []
  const next = (): Promise<void> => {
    if (cursor >= totalChunks) return Promise.resolve()
    const index = cursor++
    return worker(index).then(next)
  }
  for (let i = 0; i < Math.min(concurrency, totalChunks); i++) queue.push(next())
  await Promise.all(queue)

  clearChunksState(id)
  onProgress?.(100, file.size, file.size)
}