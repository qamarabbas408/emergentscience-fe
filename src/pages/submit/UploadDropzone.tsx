import { useState, useRef } from 'react'
import { FileText, Image as ImageIcon, Layers, X, AlertCircle } from 'lucide-react'

interface UploadDropzoneProps {
  title: string
  hint: string
  acceptTypes?: string
  badgeText?: string
  files: string[]
  onAdd: (names: string[]) => void
  onRemove: (name: string) => void
  required?: boolean
  error?: string
  iconType?: 'document' | 'image' | 'supplementary'
}

export function UploadDropzone({
  title,
  hint,
  acceptTypes,
  badgeText,
  files,
  onAdd,
  onRemove,
  required,
  error,
  iconType = 'document',
}: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const names = Array.from(fileList).map((f) => f.name)
    onAdd(names)
  }

  const renderIcon = () => {
    switch (iconType) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-primary" />
      case 'supplementary':
        return <Layers className="h-5 w-5 text-primary" />
      default:
        return <FileText className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
          {title}
          {required && <span className="text-danger">*</span>}
        </label>
        {badgeText && (
          <span className="rounded-md bg-body px-2 py-0.5 text-[10px] font-semibold text-ink-muted border border-border">
            {badgeText}
          </span>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragActive(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`group mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
          dragActive
            ? 'border-primary bg-primary-tint/60 ring-2 ring-primary/20'
            : error
            ? 'border-danger/40 bg-red-50/20 hover:border-danger'
            : 'border-border bg-body/50 hover:border-primary/60 hover:bg-white'
        }`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-2xs border border-border/80 group-hover:scale-105 transition-transform">
          {renderIcon()}
        </div>

        <p className="mt-3 text-xs leading-relaxed text-ink-secondary">
          <span className="font-semibold text-primary group-hover:underline">Click to upload</span> or drag and drop files here
        </p>

        <p className="mt-1 text-[11px] text-ink-muted">{hint}</p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptTypes}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((fileName) => {
            const isPdf = /\.pdf$/i.test(fileName)
            const isDoc = /\.(docx?|tex)$/i.test(fileName)

            return (
              <li
                key={fileName}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                      isPdf
                        ? 'bg-red-50 text-red-700'
                        : isDoc
                        ? 'bg-primary-tint text-primary'
                        : 'bg-body text-ink-secondary'
                    }`}
                  >
                    {isPdf ? 'PDF' : isDoc ? 'DOC' : 'FILE'}
                  </div>
                  <span className="truncate font-medium text-ink">{fileName}</span>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Ready
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(fileName)
                  }}
                  aria-label={`Remove file ${fileName}`}
                  className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-danger">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
