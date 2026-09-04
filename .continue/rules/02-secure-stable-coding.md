---
name: Secure, stable coding (short checklist)
description: Non-negotiables for secrets, edits, git, and verification.
alwaysApply: true
---

# Stable, accurate, secure coding rules

- Never expose, print, summarize, or modify secrets, tokens, API keys, private keys, `.env` values, credentials, or production certificates.
- Before editing code, inspect the relevant files and explain the intended change briefly.
- Prefer minimal, targeted changes over large rewrites.
- Do not run destructive commands such as `rm -rf`, `git reset --hard`, `git clean -fd`, database drops, or production deploy commands unless explicitly requested.
- Do not push, publish, deploy, delete files, or rewrite Git history unless explicitly requested.
- When uncertain, say what is uncertain instead of inventing details.
- For code changes, preserve existing architecture, naming, security patterns, logging style, and tests.
- After changes, provide the files changed, risk level, commands to test, and any assumptions.
- Prefer deterministic, testable fixes. Do not add dependencies unless clearly justified.
- For security-related work, check authentication, authorization, input validation, secret handling, logging, rate limits, and unsafe file/network access.
