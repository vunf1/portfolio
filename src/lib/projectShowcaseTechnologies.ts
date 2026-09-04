const PROGRAMMING_LANGUAGE_EXACT = new Set(
  [
    'python',
    'typescript',
    'javascript',
    'javascript (es6+)',
    'rust',
    'java',
    'c#',
    'c',
    'c++',
    'vb.net / vba',
    'php',
    'lua',
    'bash',
    'bash / shell',
    'shell',
    'powershell',
    'sql',
    'nosql',
    'node.js',
    'go',
    'golang',
    'kotlin',
    'swift',
    'ruby',
    'scala',
    'dart',
    'elixir',
    'c extensions',
  ].map((name) => name.toLowerCase())
)

const PROGRAMMING_LANGUAGE_PREFIXES = [
  'python',
  'typescript',
  'javascript',
  'rust',
  'java',
  'c#',
  'c++',
  'php',
  'lua',
  'bash',
  'powershell',
  'sql',
  'node.js',
  'go',
  'kotlin',
  'swift',
  'ruby',
  'scala',
  'dart',
  'elixir',
] as const

export function isProgrammingLanguage(tech: string): boolean {
  const normalized = tech.trim().toLowerCase()
  if (!normalized) {
    return false
  }

  if (PROGRAMMING_LANGUAGE_EXACT.has(normalized)) {
    return true
  }

  return PROGRAMMING_LANGUAGE_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix} `) || normalized.startsWith(`${prefix}/`)
  )
}

/** Languages first (stable order), then frameworks, infra, and other stack items. */
export function orderShowcaseTechnologies(technologies: string[]): string[] {
  const languages: string[] = []
  const others: string[] = []

  for (const tech of technologies) {
    if (isProgrammingLanguage(tech)) {
      languages.push(tech)
    } else {
      others.push(tech)
    }
  }

  return [...languages, ...others]
}

export function techTagClassName(tech: string): string {
  return isProgrammingLanguage(tech) ? 'cv-tag cv-tag--lang' : 'cv-tag'
}

export function getShowcaseTechnologyDisplay(
  technologies: string[],
  limit: number
): { visible: string[]; overflow: number } {
  const ordered = orderShowcaseTechnologies(technologies)
  const visible = ordered.slice(0, Math.max(0, limit))
  return {
    visible,
    overflow: Math.max(0, ordered.length - visible.length),
  }
}
