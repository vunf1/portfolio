/**
 * Compact title for Featured Projects cards: drops trailing parenthetical qualifiers
 * e.g. "License desktop manager (Python + MongoDB)" → "License desktop manager".
 */
export function getProjectShowcaseTitle(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim()
}
