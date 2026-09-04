#!/usr/bin/env node
/**
 * Install / refresh Hallmark, Taste, and Impeccable for Cursor:
 *   - project: .agents/skills + .cursor/skills
 *   - user:    ~/.cursor/skills
 *
 * Official CLIs:
 *   npx skills add nutlope/hallmark
 *   npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend
 *   npx impeccable install   (interactive; this script only copies an existing pack)
 *
 * Does not install Impeccable edit hooks.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(__dirname, '..');
const HOME = os.homedir();
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function run(args) {
  const r = spawnSync(npx, args, {
    cwd: REPO,
    encoding: 'utf8',
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (r.status !== 0) {
    throw new Error(`failed: npx ${args.join(' ')} (exit ${r.status})`);
  }
}

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function syncDir(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`missing ${src}`);
  }
  rmrf(dest);
  fs.cpSync(src, dest, { recursive: true });
  console.log(`synced ${path.relative(REPO, src) || src} -> ${dest}`);
}

function main() {
  const skillsAdd = ['--yes', 'skills', 'add'];
  const cursorFlags = ['-a', 'cursor', '-y', '--copy'];

  console.log('Installing Hallmark (user + project)...');
  run([...skillsAdd, 'nutlope/hallmark', '-g', ...cursorFlags]);
  run([...skillsAdd, 'nutlope/hallmark', ...cursorFlags]);

  console.log('Installing Taste design-taste-frontend (user + project)...');
  run([
    ...skillsAdd,
    'https://github.com/Leonxlnx/taste-skill',
    '--skill',
    'design-taste-frontend',
    '-g',
    ...cursorFlags,
  ]);
  run([
    ...skillsAdd,
    'https://github.com/Leonxlnx/taste-skill',
    '--skill',
    'design-taste-frontend',
    ...cursorFlags,
  ]);

  const agentsHallmark = path.join(REPO, '.agents', 'skills', 'hallmark');
  const agentsTaste = path.join(REPO, '.agents', 'skills', 'design-taste-frontend');
  const cursorHallmark = path.join(REPO, '.cursor', 'skills', 'hallmark');
  const cursorTaste = path.join(REPO, '.cursor', 'skills', 'design-taste-frontend');
  const cursorImpeccable = path.join(REPO, '.cursor', 'skills', 'impeccable');
  const userSkills = path.join(HOME, '.cursor', 'skills');
  fs.mkdirSync(userSkills, { recursive: true });

  syncDir(agentsHallmark, cursorHallmark);
  syncDir(agentsTaste, cursorTaste);
  syncDir(agentsHallmark, path.join(userSkills, 'hallmark'));
  syncDir(agentsTaste, path.join(userSkills, 'design-taste-frontend'));

  if (fs.existsSync(cursorImpeccable)) {
    syncDir(cursorImpeccable, path.join(userSkills, 'impeccable'));
  } else {
    console.warn(
      'Impeccable pack missing at .cursor/skills/impeccable. Run: npx impeccable install (Cursor only; skip hooks).',
    );
  }

  const hook = path.join(REPO, '.cursor', 'hooks.json');
  if (fs.existsSync(hook)) {
    fs.rmSync(hook);
    console.log('removed .cursor/hooks.json (edit hooks are not part of the default stack)');
  }

  console.log('Design skills ready (Hallmark + Taste + Impeccable).');
}

main();
