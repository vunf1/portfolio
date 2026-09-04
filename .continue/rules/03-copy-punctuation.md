---
name: Copy punctuation (no em dash)
description: EN/pt-PT punctuation; no U+2014 in public/data or src copy.
alwaysApply: true
---

# Portfolio copy marks

- **No Unicode em dash (U+2014)** in `public/data/**`, `src` user-visible strings, or `docs/`.
- Do **not** replace every `—` with `-`. Use colon (name/gloss), semicolon (related clauses), period (new thought), or parentheses (aside).
- ASCII `-` only for hyphenated words, flags, and ranges like `1-10`. Date ranges may keep an existing en dash (`2010 – Present`).
- **pt-PT**: accents, no Brazilianisms, no space before `?` `!`. Prefer `portefólio`, `utilizador`, `registo`.
- When editing a file that still has `—`, fix those hits in the same change. Check with `npm run lint:em-dash` (not wired into `npm run lint` yet).
- Ignore `.cursor/skills`, `.agents/skills`, `.claude/skills`.
