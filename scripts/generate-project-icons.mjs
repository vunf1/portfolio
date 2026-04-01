/**
 * Writes public/img/projects/<id>.svg (initials + themed motif) and can sync image paths in project JSON.
 * Run from repo root: node scripts/generate-project-icons.mjs
 *
 * PNG/SVG assets must live under public/img/projects/ (Vite serves public/ at site root).
 * JSON uses paths like ./img/projects/file.png; the app resolves them with publicAssetUrl() + BASE_URL.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const PNG_BY_ID = {
  'stream-futebol-dashboard': './img/projects/apitofinal_logo.png',
  'contecnica-landing-platform': './img/projects/contecnica-logo.png',
  'wisdom-jobs-tracking': './img/projects/wisdom_logo.png',
}

const REMOTE_IMAGE_BY_ID = {
  'effigy-credit-brokerage': 'https://effigy.pt/api/assets/images/brand/navbar-logo.svg',
}

function projectInitials(name) {
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

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function hueFromId(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0
  }
  return h % 360
}

/** Decorative layer hinting domain (stroke-only, low contrast). */
function motifSvg(id) {
  const k = id.toLowerCase()
  const S = 'stroke="#fff" stroke-opacity="0.14" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"'

  if (/stream|futebol|scoreboard|cs2|overlay/.test(k)) {
    return `<g ${S}>
      <path d="M28 232 Q128 172 228 232 T428 232" />
      <path d="M52 264 Q156 204 260 264 T460 264" />
    </g>`
  }
  if (/(^|-)license|licensehub/.test(k)) {
    return `<g ${S}><path d="M468 44h104v76l-52 32-52-32V44z"/><path d="M520 84v36"/></g>`
  }
  if (/docker|n8n|podman|taiga|compose/.test(k)) {
    return `<g ${S}>
      <path d="M520 52l26 15v30l-26 15-26-15V67l26-15z"/>
      <path d="M472 118l26 15v30l-26 15-26-15v-30l26-15z"/>
      <path d="M568 118l26 15v30l-26 15-26-15v-30l26-15z"/>
    </g>`
  }
  if (/ecommerce|vendure/.test(k)) {
    return `<g ${S}><path d="M472 72h96l-8 56H484l-6 36h76"/><path d="M488 56v16"/></g>`
  }
  if (/wordpress|nirvanamed/.test(k)) {
    return `<g ${S}><path d="M508 48c-28 0-52 22-52 52s24 52 52 52 52-22 52-52-24-52-52-52zm0 20v64m-32-32h64"/></g>`
  }
  if (/python|pyqt|pyside|metin2/.test(k)) {
    return `<g ${S}>
      <path d="M460 200c40-48 72-20 88 8s28 56 72 52"/>
      <path d="M472 248c36 40 80 24 100-4"/>
    </g>`
  }
  if (/lol|catalog|nexus/.test(k)) {
    return `<g stroke="#fff" stroke-opacity="0.12" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="468" y="56" width="28" height="28" rx="4"/><rect x="508" y="56" width="28" height="28" rx="4"/>
      <rect x="468" y="96" width="28" height="28" rx="4"/><rect x="508" y="96" width="28" height="28" rx="4"/>
    </g>`
  }
  if (/incident|response/.test(k)) {
    return `<g stroke="#fff" stroke-opacity="0.14" fill="none" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M520 48 L540 108 L480 108 Z"/><path d="M520 120v48"/></g>`
  }
  if (/backup|packaging/.test(k)) {
    return `<g ${S}><path d="M472 96c0-24 22-44 48-44s48 20 48 44v12H472V96z"/><path d="M496 52v24h48V52"/></g>`
  }
  if (/image-database|database/.test(k)) {
    return `<g ${S}><ellipse cx="520" cy="88" rx="44" ry="16"/><path d="M476 88v48c0 10 20 18 44 18s44-8 44-18V88"/></g>`
  }
  if (/auto-close|pids/.test(k)) {
    return `<g ${S}><circle cx="520" cy="100" r="44"/><path d="M492 72l56 56M548 72l-56 56"/></g>`
  }
  if (/php-version|tauri/.test(k)) {
    return `<g ${S}><circle cx="520" cy="100" r="20"/><path d="M520 56v16M520 124v16M484 100h16M540 100h16"/></g>`
  }
  if (id === 'msl-work-infoplus-cli') {
    return `<g font-family="ui-monospace,monospace" fill="#fff" fill-opacity="0.1" stroke="none">
      <text x="472" y="108" font-size="38">&gt;_</text>
    </g>`
  }
  if (id === 'msl-work-infoplus-gui') {
    return `<g ${S}><rect x="472" y="56" width="96" height="64" rx="8"/><path d="M472 80h96"/></g>`
  }
  if (id === 'msl-work-report') {
    return `<g ${S}><rect x="480" y="52" width="72" height="88" rx="6"/><path d="M496 76h40M496 96h40M496 116h28"/></g>`
  }
  if (id === 'msl-work-system-tray') {
    return `<g ${S}><rect x="472" y="100" width="96" height="28" rx="6"/><circle cx="488" cy="114" r="6"/><circle cx="520" cy="114" r="6"/></g>`
  }
  if (id === 'msl-work-touchscreen') {
    return `<g ${S}><rect x="472" y="56" width="96" height="120" rx="10"/><circle cx="520" cy="160" r="8" fill="#fff" fill-opacity="0.12" stroke="none"/></g>`
  }
  if (/effigy-fiscal|fiscal/.test(k)) {
    return `<g ${S}><path d="M480 52h80v88H480z"/><path d="M496 76h48M496 96h48M496 116h32"/></g>`
  }
  if (/rust/.test(k)) {
    return `<g ${S}><path d="M520 52l36 20v40l-36 20-36-20V72l36-20z"/></g>`
  }

  const r = 52 + (hueFromId(id + 'm') % 3) * 8
  return `<g fill="#fff" fill-opacity="0.08" stroke="none">
    <circle cx="560" cy="72" r="${r}"/>
    <circle cx="88" cy="288" r="${Math.round(r * 0.65)}"/>
  </g>`
}

function buildSvg(id, name) {
  const sid = id.replace(/[^a-zA-Z0-9]/g, '') || 'icon'
  const ini = escapeXml(projectInitials(name))
  const label = escapeXml(id.replace(/-/g, ' · '))
  const h = hueFromId(id)
  const h2 = (h + 42) % 360
  const sat = 48 + (hueFromId(id + 's') % 14)
  const motif = motifSvg(id)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-labelledby="title-${sid}">
  <title id="title-${sid}">${escapeXml(name)}</title>
  <defs>
    <linearGradient id="g-${sid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(${h},${sat}%,36%)"/>
      <stop offset="100%" stop-color="hsl(${h2},${Math.min(60, sat + 8)}%,26%)"/>
    </linearGradient>
    <filter id="sh-${sid}">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="640" height="360" rx="28" fill="url(#g-${sid})"/>
  ${motif}
  <text x="320" y="200" text-anchor="middle" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif" font-size="108" font-weight="700" letter-spacing="-0.04em" fill="#fff" filter="url(#sh-${sid})">${ini}</text>
  <text x="320" y="308" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" font-weight="500" fill="#fff" fill-opacity="0.74" letter-spacing="0.04em">${label}</text>
</svg>
`
}

function imagePathForId(id) {
  if (PNG_BY_ID[id]) return PNG_BY_ID[id]
  if (REMOTE_IMAGE_BY_ID[id]) return REMOTE_IMAGE_BY_ID[id]
  return `./img/projects/${id}.svg`
}

const enDir = path.join(root, 'public/data/en/projects')
const ptDir = path.join(root, 'public/data/pt-PT/projects')
const outDir = path.join(root, 'public/img/projects')

fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(enDir).filter((f) => f.endsWith('.json') && f !== 'manifest.json')

for (const f of files) {
  const id = path.basename(f, '.json')
  const j = JSON.parse(fs.readFileSync(path.join(enDir, f), 'utf8'))

  if (!PNG_BY_ID[id] && !REMOTE_IMAGE_BY_ID[id]) {
    const svg = buildSvg(id, j.name || id)
    fs.writeFileSync(path.join(outDir, `${id}.svg`), svg, 'utf8')
  }

  const img = imagePathForId(id)
  for (const dir of [enDir, ptDir]) {
    const p = path.join(dir, f)
    const data = JSON.parse(fs.readFileSync(p, 'utf8'))
    data.image = img
    fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8')
  }
}

console.log(`Updated ${files.length} projects: SVG icons + image paths (EN + pt-PT).`)
