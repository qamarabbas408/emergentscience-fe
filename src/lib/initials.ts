const INITIAL_STOP_WORDS = new Set(['in', 'of', 'and', 'the', 'for', 'on', 'at', 'a', 'an', 'to', '&'])

export function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter((w) => !INITIAL_STOP_WORDS.has(w.toLowerCase()))
      .slice(0, 3)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'J'
  )
}