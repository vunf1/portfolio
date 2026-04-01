/**
 * Two-letter mark for project cards when no image URL is set.
 * Strips subtitle after en dash, em dash, hyphen run, or colon; then uses the first two letter/digit word tokens (handles middots and punctuation between words).
 */
export function projectInitials(name: string): string {
  const beforeSep = name.replace(/[\u2013\u2014\-:].*$/, '').trim()
  const words = beforeSep.split(/[^a-zA-Z0-9\u00C0-\u024F]+/).filter((w) => w.length > 0)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return beforeSep.slice(0, 2).toUpperCase()
}
