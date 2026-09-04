/**
 * Replace U+2014 in product copy using the portfolio punctuation rule.
 * Gloss / stack: colon. Contrast starting with not/no/não/sem: period.
 * Run: node scripts/fix-em-dashes.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const EM = '\u2014'

const EXT = new Set([
  '.ts',
  '.tsx',
  '.css',
  '.json',
  '.md',
  '.mjs',
  '.js',
  '.cjs',
  '.html',
  '.yml',
  '.yaml'
])

const SKIP_DIR = new Set([
  'node_modules',
  'dist',
  '.vite',
  'coverage',
  '.git',
  '.cursor',
  '.agents',
  '.claude',
  '.continue',
  'storybook-static'
])

const ROOTS = ['public/data', 'src', 'docs']

function* walk(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (SKIP_DIR.has(ent.name)) {
        continue
      }
      yield* walk(p)
    } else if (EXT.has(path.extname(ent.name))) {
      yield p
    }
  }
}

function replaceEmDashesSmart(text) {
  let out = ''
  let i = 0
  while (i < text.length) {
    const idx = text.indexOf(EM, i)
    if (idx === -1) {
      out += text.slice(i)
      break
    }
    let start = idx
    while (start > 0 && text[start - 1] === ' ') {
      start -= 1
    }
    out += text.slice(i, start)
    let end = idx + EM.length
    while (end < text.length && text[end] === ' ') {
      end += 1
    }
    const rest = text.slice(end)
    const contrast = /^(not\b|no\b|não\b|nao\b|sem\b)/i.test(rest)
    if (contrast) {
      const ch = rest[0]
      out += `. ${ch.toUpperCase() === ch ? ch : ch.toUpperCase()}`
      i = end + 1
    } else {
      out += ': '
      i = end
    }
  }
  return out
}

let files = 0
let replacements = 0
for (const rel of ROOTS) {
  for (const file of walk(path.join(ROOT, rel))) {
    const before = fs.readFileSync(file, 'utf8')
    if (!before.includes(EM)) {
      continue
    }
    const after = replaceEmDashesSmart(before)
    const n = before.split(EM).length - 1
    fs.writeFileSync(file, after)
    files += 1
    replacements += n
    console.log(`${path.relative(ROOT, file)}: ${n}`)
  }
}

console.log(`Updated ${files} files (${replacements} marks).`)
