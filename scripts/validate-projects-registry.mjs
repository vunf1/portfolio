#!/usr/bin/env node
/**
 * Enforces projects-registry.json: blocked ids/repos must never enter the portfolio,
 * and attached release repos stay linked to their parent project only.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA = path.join(ROOT, 'public', 'data')
const REGISTRY_PATH = path.join(DATA, 'projects-registry.json')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function manifestIds(locale) {
  const manifestPath = path.join(DATA, locale, 'projects', 'manifest.json')
  const files = readJson(manifestPath)
  if (!Array.isArray(files)) {
    throw new Error(`${manifestPath}: expected string[] manifest`)
  }
  return files.map((f) => f.replace(/\.json$/i, ''))
}

function projectJsonIds(locale) {
  const dir = path.join(DATA, locale, 'projects')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'manifest.json')
    .map((f) => f.replace(/\.json$/i, ''))
}

function fail(messages) {
  for (const m of messages) console.error(`✗ ${m}`)
  process.exit(1)
}

function main() {
  const errors = []
  const registry = readJson(REGISTRY_PATH)
  const blocked = new Set(registry.blockedProjectIds ?? [])
  const attached = registry.attachedReleaseRepos ?? {}

  const area = readJson(path.join(DATA, 'projects-area.json'))
  const enManifest = manifestIds('en')
  const ptManifest = manifestIds('pt-PT')

  if (JSON.stringify(enManifest) !== JSON.stringify(ptManifest)) {
    errors.push('EN and pt-PT projects/manifest.json must list the same files in the same order')
  }

  for (const id of blocked) {
    if (enManifest.includes(id)) errors.push(`Blocked project "${id}" is still listed in projects/manifest.json`)
    if (Object.prototype.hasOwnProperty.call(area, id)) {
      errors.push(`Blocked project "${id}" is still listed in projects-area.json — remove the key`)
    }
    for (const locale of ['en', 'pt-PT']) {
      const file = path.join(DATA, locale, 'projects', `${id}.json`)
      if (fs.existsSync(file)) errors.push(`Blocked project file still exists: ${path.relative(ROOT, file)}`)
    }
  }

  for (const parentId of Object.keys(attached)) {
    if (!enManifest.includes(parentId)) {
      errors.push(`attachedReleaseRepos parent "${parentId}" is missing from projects/manifest.json`)
    }
    const childSlug = attached[parentId]?.localFolder
      ?.replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
    if (childSlug && blocked.has(childSlug)) {
      errors.push(`attachedReleaseRepos localFolder for "${parentId}" must not be a blocked project id`)
    }
  }

  const allIds = new Set([...enManifest, ...projectJsonIds('en'), ...projectJsonIds('pt-PT')])
  for (const id of allIds) {
    if (blocked.has(id)) errors.push(`Blocked project id present in portfolio data: "${id}"`)
  }

  for (const locale of ['en', 'pt-PT']) {
    const manifestPath = path.join(DATA, locale, 'projects', 'manifest.json')
    const files = readJson(manifestPath)
    if (!Array.isArray(files)) {
      errors.push(`${manifestPath}: expected string[] manifest`)
      continue
    }
    for (const file of files) {
      const projectPath = path.join(DATA, locale, 'projects', file)
      if (!fs.existsSync(projectPath)) {
        errors.push(`Missing project file listed in manifest: ${path.relative(ROOT, projectPath)}`)
        continue
      }
      try {
        readJson(projectPath)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        errors.push(`Invalid JSON in ${path.relative(ROOT, projectPath)}: ${msg}`)
      }
    }
  }

  try {
    readJson(path.join(DATA, 'projects-area.json'))
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    errors.push(`Invalid JSON in public/data/projects-area.json: ${msg}`)
  }

  if (errors.length) fail(errors)
  console.log('✓ projects-registry validation passed')
}

main()
