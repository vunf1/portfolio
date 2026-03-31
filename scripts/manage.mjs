#!/usr/bin/env node
/**
 * Portfolio - Management Console (Node.js TUI)
 * Section-based menu: Section → Action. Launched by manage.ps1.
 * Runs npm scripts from repo root.
 */
import { intro, outro, select, note, isCancel } from '@clack/prompts'
import pc from 'picocolors'
import { spawn } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

process.chdir(ROOT)

// Sections with actions: sectionId -> { label, hint, actions }
const SECTIONS = {
  setup: {
    label: 'Setup',
    hint: 'Install and verify',
    actions: [
      { value: '1', label: 'Install dependencies', hint: 'npm install' },
      { value: '2', label: 'Verify dist (after build)', hint: 'npm run verify-dist' },
    ],
  },
  dev: {
    label: 'Dev',
    hint: 'Development server',
    actions: [
      { value: '3', label: 'Start dev server', hint: 'npm run dev' },
      { value: '4', label: 'Start dev (fast, no copy-data)', hint: 'npm run dev:fast' },
      { value: '5', label: 'Preview production build', hint: 'npm run preview' },
    ],
  },
  build: {
    label: 'Build',
    hint: 'Type-check, lint, test, build',
    actions: [
      { value: '6', label: 'Full build (test + type-check + lint + build)', hint: 'npm run build' },
      { value: '7', label: 'Build for GitHub Pages', hint: 'npm run build:gh-pages' },
      { value: '8', label: 'Type-check only', hint: 'npm run type-check' },
      { value: '9', label: 'Lint only', hint: 'npm run lint' },
      { value: '10', label: 'Run tests', hint: 'npm run test' },
      { value: '11', label: 'Test with coverage', hint: 'npm run test:coverage' },
    ],
  },
  quality: {
    label: 'Quality',
    hint: 'Format and security',
    actions: [
      { value: '12', label: 'Format (Prettier)', hint: 'npm run format' },
      { value: '13', label: 'Format check', hint: 'npm run format:check' },
      { value: '14', label: 'Lint fix', hint: 'npm run lint:fix' },
      { value: '15', label: 'Security audit', hint: 'npm run security:audit' },
    ],
  },
  deploy: {
    label: 'Deploy',
    hint: 'Build and publish',
    actions: [
      { value: '20', label: 'Deploy to GitHub Pages', hint: 'npm run deploy (build + gh-pages)' },
    ],
  },
  tools: {
    label: 'Tools',
    hint: 'Scripts and assets',
    actions: [
      { value: '30', label: 'Copy data (images, .nojekyll)', hint: 'npm run copy-data' },
      { value: '31', label: 'Optimize images', hint: 'npm run optimize:images' },
      { value: '32', label: 'Generate OG image', hint: 'npm run generate:og-image' },
      { value: '33', label: 'Test n8n request', hint: 'npm run test:n8n' },
    ],
  },
  clean: {
    label: 'Clean',
    hint: 'Remove build artifacts',
    actions: [
      { value: '40', label: 'Clean dist and Vite cache', hint: 'npm run clean' },
      { value: '41', label: 'Clean all (dist, cache, node_modules, lockfile)', hint: 'npm run clean:all' },
      { value: '42', label: 'Reinstall (clean:all + npm install)', hint: 'npm run reinstall' },
    ],
  },
}

function runShell(cwd, command) {
  return new Promise((resolve) => {
    const child = spawn(command, {
      stdio: 'inherit',
      cwd,
      shell: true,
    })
    child.on('close', (code) => resolve(code ?? 0))
    child.on('error', () => resolve(1))
  })
}

function runAction(key) {
  const actions = {
    '1': () => runShell(ROOT, 'npm install'),
    '2': () => runShell(ROOT, 'npm run verify-dist'),
    '3': () => runShell(ROOT, 'npm run dev'),
    '4': () => runShell(ROOT, 'npm run dev:fast'),
    '5': () => runShell(ROOT, 'npm run preview'),
    '6': () => runShell(ROOT, 'npm run build'),
    '7': () => runShell(ROOT, 'npm run build:gh-pages'),
    '8': () => runShell(ROOT, 'npm run type-check'),
    '9': () => runShell(ROOT, 'npm run lint'),
    '10': () => runShell(ROOT, 'npm run test'),
    '11': () => runShell(ROOT, 'npm run test:coverage'),
    '12': () => runShell(ROOT, 'npm run format'),
    '13': () => runShell(ROOT, 'npm run format:check'),
    '14': () => runShell(ROOT, 'npm run lint:fix'),
    '15': () => runShell(ROOT, 'npm run security:audit'),
    '20': () => runShell(ROOT, 'npm run deploy'),
    '30': () => runShell(ROOT, 'npm run copy-data'),
    '31': () => runShell(ROOT, 'npm run optimize:images'),
    '32': () => runShell(ROOT, 'npm run generate:og-image'),
    '33': () => runShell(ROOT, 'npm run test:n8n'),
    '40': () => runShell(ROOT, 'npm run clean'),
    '41': () => runShell(ROOT, 'npm run clean:all'),
    '42': () => runShell(ROOT, 'npm run reinstall'),
  }
  const fn = actions[key]
  if (!fn) {
    console.error(pc.red(`Unknown action: ${key}`))
    return Promise.resolve(1)
  }
  return fn()
}

function renderStatusPanel() {
  const lines = [
    `${pc.bold('Repo:')}  ${ROOT}`,
    `${pc.bold('Node:')}  ${process.version}`,
  ]
  note(lines.join('\n'), pc.bold('Portfolio: Status'))
}

async function pickSection() {
  return select({
    message: 'Select a section',
    options: [
      { value: 'setup', label: `${pc.yellow('Setup')}: Install and verify`, hint: '2 actions' },
      { value: 'dev', label: `${pc.magenta('Dev')}: Development server`, hint: '3 actions' },
      { value: 'build', label: `${pc.blue('Build')}: Test, lint, build`, hint: '6 actions' },
      { value: 'quality', label: `${pc.green('Quality')}: Format and security`, hint: '4 actions' },
      { value: 'deploy', label: `${pc.cyan('Deploy')}: GitHub Pages`, hint: '1 action' },
      { value: 'tools', label: `${pc.gray('Tools')}: Scripts and assets`, hint: '4 actions' },
      { value: 'clean', label: `${pc.red('Clean')}: Remove artifacts`, hint: '3 actions' },
      { value: 'exit', label: pc.dim('Exit') },
    ],
  })
}

async function pickAction(sectionId) {
  const section = SECTIONS[sectionId]
  if (!section) return null

  const options = section.actions.map((a) => ({
    value: a.value,
    label: a.label,
    hint: a.hint,
  }))

  return select({
    message: `${section.label}: ${section.hint}`,
    options: [
      ...options,
      { value: '__back__', label: pc.dim('← Back to sections') },
    ],
  })
}

async function main() {
  const allKeys = new Set(
    Object.values(SECTIONS).flatMap((s) => s.actions.map((a) => a.value))
  )
  const oneShot = process.argv[2]
  if (oneShot && allKeys.has(oneShot)) {
    const code = await runAction(oneShot)
    process.exit(code)
  }

  intro(pc.bold(' Portfolio: Management Console '))
  renderStatusPanel()
  console.log()

  while (true) {
    const section = await pickSection()

    if (isCancel(section) || section === 'exit') {
      outro('Done.')
      break
    }

    const action = await pickAction(section)
    if (isCancel(action)) continue
    if (action === '__back__') continue

    const code = await runAction(action)
    if (code !== 0) {
      console.log(pc.red(`\nAction exited with code ${code}.`))
    }
    console.log()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
