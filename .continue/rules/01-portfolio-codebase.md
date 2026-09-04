---
name: Portfolio codebase & docs map
description: Where code and content live; stack and official docs for this repo.
alwaysApply: true
---

# João Maia portfolio (this workspace)

Bilingual EN/PT portfolio/CV landing: **Vite**, **Preact**, **TypeScript**. Prefer existing CSS tokens and patterns under `src/css/` (base, landing, fab).

## Layout (high signal paths)

| Area | Path |
|------|------|
| App entry, routing | `src/main.tsx`, `src/App.tsx`, `src/config/routes.ts` |
| Landing / sections | `src/components/landing/`, `src/components/*.tsx` |
| UI primitives | `src/components/ui/` |
| i18n | `src/contexts/TranslationContext.tsx`, `src/lib/locale.ts` |
| Data loading | `src/hooks/usePortfolioData.ts`, `public/data/` (locale JSON) |
| Project allow/block | `public/data/projects-registry.json`, `npm run validate:projects` |
| Forms / backend hooks | `src/utils/n8nClient.ts`, `src/utils/validation.ts`, `src/types/n8n.ts` |
| Styles | `src/css/`, `src/css/variables.css`, `src/css/tokens.css` |
| Tests | `src/**/__tests__/**`, `vitest` in `package.json` |
| Build / data copy | `vite.config.*`, `scripts/copy-data.cjs` |

## When answering or editing

- Inspect real files and `public/data/*/meta.json` (or section JSON) before asserting content.
- Match existing component and CSS naming; do not introduce a new UI stack.
- Run `npm test`, `npm run type-check`, or `npm run lint` when changing logic (see `package.json` scripts).

## Official documentation (cite when explaining APIs)

- [Vite](https://vite.dev/guide/)
- [Preact](https://preactjs.com/guide/v10/getting-started)
- [Vitest](https://vitest.dev/guide/)
- [TypeScript handbook](https://www.typescriptlang.org/docs/)

**Context7** is configured under `mcpServers` in `.continue/configs/config.yaml` (Agent mode). Use it for version-specific library docs; optional `CONTEXT7_API_KEY` env on the MCP process improves rate limits ([Context7](https://github.com/upstash/context7), [Continue MCP](https://docs.continue.dev/customize/deep-dives/mcp)).
