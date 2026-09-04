/**
 * Fails if Unicode em dash U+2014 appears in product copy:
 * public/data, src, docs (not skill packs or build output).
 * Run: npm run lint:em-dash
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

const targets = []
for (const rel of ROOTS) {
  for (const f of walk(path.join(ROOT, rel))) {
    targets.push(f)
  }
}

const hits = []
for (const file of targets) {
  let text
  try {
    text = fs.readFileSync(file, 'utf8')
  } catch {
    continue
  }
  if (!text.includes(EM)) {
    continue
  }
  const lines = text.split(/\r?\n/)
  lines.forEach((line, i) => {
    if (line.includes(EM)) {
      hits.push({ file, line: i + 1, snippet: line.trim().slice(0, 140) })
    }
  })
}

if (hits.length) {
  console.error('Em dash (U+2014) is not allowed in public/data, src, or docs.')
  console.error('Replace with colon, semicolon, period, or parentheses. Do not blind-swap to "-".')
  for (const h of hits) {
    console.error(`  ${path.relative(ROOT, h.file)}:${h.line}: ${h.snippet}`)
  }
  process.exit(1)
}

console.log('check-no-em-dash: ok (public/data + src + docs)')
