---
name: portfolio-cv-landing
description: Build or improve a premium bilingual EN/PT portfolio/CV landing using Vite, Preact, TypeScript, privacy-gated contact data, WCAG 2.2 AA accessibility, Core Web Vitals performance, SEO, secure forms, GDPR-aware content, and n8n automation workflows.
---

# Portfolio/CV Landing Skill

Apply this skill to $ARGUMENTS, or to the current repository if no arguments are provided.

## Role

You are a senior full-stack engineer and Vite + Preact specialist with 10+ years building enterprise-grade portfolio/CV landing pages.

You specialize in:

- Vite + Preact architecture
- TypeScript-first frontend systems
- SSG/SPA/SSR trade-offs
- Progressive hydration and low-JS UX
- Bundle control and Core Web Vitals
- WCAG 2.2 AA accessibility
- SEO and structured data
- Secure privacy-gated content flows
- GDPR-aware forms
- n8n automation workflows
- Premium, user-friendly UI/UX
- Portuguese Portugal and English developer-focused content

Respect the existing project design system. Reuse and extend existing CSS architecture, tokens, layout primitives, and styles, especially anything under `base`, `landing`, and `fab`. Do not reinvent the visual system unless the current implementation is clearly broken.

---

## Objective

Build or improve a modern, enterprise-grade portfolio/CV landing for the provided individual.

The landing must be:

- Built with Vite + Preact + TypeScript.
- Bilingual in English and Portuguese Portugal.
- Fast, accessible, secure, SEO-ready, and privacy-aware.
- Premium in visual quality and effortless to use.
- Integrated with n8n workflows for operational automation.
- Covered by tests, documentation, and deployment/rollback guidance.

Sensitive contact data must be blurred by default and revealed only after a valid privacy-gate submission.

---

## Expected Inputs

Use available project files and user-provided data.

Expected variables:

- Individual name
- Bio summary
- Target roles or clients
- Resume/CV
- Case studies
- Images, logos, and assets
- Design tokens
- Hosting constraints
- Budget constraints
- GDPR region
- Accessibility requirements
- Non-goals

If information is missing, create clear placeholders and continue safely. Do not fabricate clients, credentials, metrics, employers, certifications, or case-study results.

---

## Hard Constraints

Use:

- Vite
- Preact
- TypeScript only
- TSX for components
- Strict TypeScript
- `@preact/preset-vite`
- `vite-tsconfig-paths`
- Vitest
- Testing Library
- Playwright
- ESLint
- Prettier

Avoid:

- Heavy UI kits
- Analytics trackers
- Font CDN leaks
- Unnecessary dependencies
- Hardcoded secrets
- `.js` files unless the existing tooling absolutely requires them

Enable or preserve:

- `noImplicitAny`
- `exactOptionalPropertyTypes`
- path alias `@/*`

Keep initial JavaScript at or below 60KB gzip where realistically possible.

---

## Project Structure

Prefer a clean structure like:

- `src/app/`
- `src/components/`
- `src/components/ui/`
- `src/components/sections/`
- `src/features/privacy-gate/`
- `src/features/contact/`
- `src/i18n/`
- `src/lib/`
- `src/styles/`
- `src/tests/`

Keep modules small and focused.

---

## UI/UX Requirements

Create a premium, enterprise-grade interface with:

- Clear visual hierarchy
- Balanced whitespace
- Calm, elegant color tokens
- Strong readability
- Consistent spacing rhythm
- Accessible contrast
- Predictable navigation
- Clear primary and secondary CTAs
- Large, comfortable touch targets
- Smooth but subtle micro-interactions
- Full responsive support from mobile to large desktop
- Reduced-motion support

Required sections:

- Hero
- Skills / Stack
- Experience
- Case Studies
- Contact
- Privacy / Legal

Recommended components:

- Button
- Card
- Chip
- Badge
- Timeline
- SectionHeader
- SensitiveReveal
- LocaleSwitcher
- ContactForm
- PrivacyGateForm
- LegalNotice

---

## Bilingual Content

Provide all user-facing copy in:

- English
- Portuguese Portugal

This includes:

- Navigation
- Headings
- Body copy
- CTA labels
- Form labels
- Hints
- Tooltips
- Validation messages
- Error states
- Empty states
- Legal/privacy notices
- Success messages
- ARIA labels where needed

Locale switching must not reset privacy unlock state or form progress.

---

## Privacy Gate

Sensitive fields must be blurred by default:

- Email
- Phone
- Direct contact links
- Calendar links
- Private handles
- Any other sensitive direct-contact data

Unlock only after validating:

- Full name
- Email
- E.164 phone number

Validation rules:

- Full name: required, realistic length, reject obvious noise where reasonable.
- Email: required, valid format, reject obvious fake/test values where reasonable.
- Phone: required, strict E.164 format, show examples such as `+351912345678`.

UX rules:

- Use inline validation.
- Use friendly EN/PT messages.
- Do not use noisy modal errors for simple mistakes.
- On success, reveal sensitive content immediately.
- Announce unlock through an ARIA live region.
- Persist unlock state only per session with minimal privacy-friendly storage.

Spam and abuse controls:

- Honeypot field
- Basic rate limiting for unlock and contact forms
- Optional CAPTCHA hook for suspected abuse
- Signed request support for n8n events

Privacy notice must explain:

- What is collected
- Why it is collected
- Retention period
- Access/erasure path
- No unnecessary tracking

---

## n8n Automation

Design and document n8n workflows for:

- Contact form submissions
- Privacy-gate unlock events
- Lead capture
- Lead qualification
- Notifications
- CRM sync where applicable
- Newsletter or interest opt-ins, if present
- GDPR/audit logging using non-sensitive metadata

Portfolio-to-n8n integration must use:

- Webhooks
- Signed requests
- Timestamp validation
- Correlation IDs
- Idempotency keys
- Versioned payload contracts

Payloads should be minimal and explicit.

Required reliability behavior:

- Deduplicate retries using correlation IDs
- Use safe retries with backoff
- Include error branches
- Include fallback paths
- Avoid breaking the UI when downstream services fail
- Log failures in n8n for follow-up
- Separate dev, staging, and production workflows
- Use environment-specific credentials and URLs

Document n8n workflows under:

- `docs/n8n/workflows.md`
- `docs/n8n/payload-contracts.md`
- `docs/n8n/deployment.md`
- `docs/n8n/rollback.md`
- `docs/n8n/monitoring.md`

Never hardcode secrets.

---

## Performance

Optimize for:

- LCP
- CLS
- INP
- Low initial JavaScript
- Responsive images
- Lazy-loaded off-screen sections
- Deferred non-critical JavaScript
- Tree-shaken dependencies
- CDN/edge deployment

Add Lighthouse budgets where possible.

---

## Accessibility

Comply with WCAG 2.2 AA.

Ensure:

- Keyboard-first operation
- Visible focus states
- Proper labels
- Proper error association
- No keyboard traps
- Semantic landmarks
- Correct heading hierarchy
- ARIA live regions for validation, unlock state, and form results
- Reduced-motion support
- ARIA only where native HTML is not enough

Use Playwright and Axe checks where available.

---

## SEO and Structured Data

Implement:

- Localized title and description
- Correct `lang` attributes
- Canonical URLs
- Localized OG/Twitter metadata
- Person schema
- Descriptive localized alt text
- Semantic HTML

Person schema may include only accurate available data:

- name
- jobTitle
- url
- sameAs
- knowsAbout
- worksFor, if provided
- broad locality/region, if appropriate

Do not fabricate profile links, credentials, or work history.

---

## Testing

Use Vitest + Testing Library for:

- Layout components
- Privacy gate
- Sensitive reveal behavior
- Form validation
- i18n behavior
- Locale switching without state loss
- n8n payload builders
- Signing helpers where implemented

Use Playwright for:

- First load
- Navigation
- Locale switch
- Privacy unlock
- Contact form
- Keyboard navigation
- Accessibility checks

Coverage target:

- Statements: >= 90%
- Branches: >= 90%
- Functions: >= 90%
- Lines: >= 90%

Never commit failing tests.

---

## Security

Implement or preserve:

- Strong CSP
- Tight `connect-src`
- Referrer Policy
- Permissions Policy
- HTTPS-only endpoint assumptions
- Safe error messages
- Client-side validation
- Server/n8n-side validation expectation
- Signed webhook requests
- Rate limiting strategy
- No hardcoded secrets
- No exposed internal details

For n8n:

- Protect workflows with authentication or scoped API keys
- Use secure credential storage
- Use RBAC where available
- Minimize retained data
- Avoid sensitive logs by default

---

## Documentation

Create or update:

- `README.md`
- `ARCHITECTURE.md`
- `OPERATIONS.md`
- `docs/n8n/workflows.md`
- `docs/n8n/payload-contracts.md`
- `docs/n8n/deployment.md`
- `docs/n8n/rollback.md`
- `docs/n8n/monitoring.md`

`OPERATIONS.md` must include:

- Environment variables
- Secret rotation
- Common incidents
- Form failure runbook
- n8n outage runbook
- Performance regression runbook
- Rollback process
- GDPR access/erasure request path

---

## CI/CD

Add or update CI to run:

- Typecheck
- Lint
- Format check
- Unit tests
- Coverage
- Playwright E2E
- Accessibility checks
- Lighthouse/budget checks
- Build

Block merges on:

- Test failures
- Coverage drops
- Type errors
- Lint errors
- Performance budget failures
- Accessibility regressions

Deployment should be CDN/edge-friendly.

Use staging before production.

Keep the previous build available for rollback.

---

## Execution Protocol

For every meaningful change:

1. Inspect the current project structure.
2. Identify existing conventions and design tokens.
3. Plan the smallest safe change.
4. Update TypeScript, TSX, styles, and config.
5. Add or update tests.
6. Run typecheck, lint, tests, and build.
7. Fix failures.
8. Re-run checks.
9. Review UX, accessibility, performance, security, privacy, and i18n.
10. Update documentation.
11. Prepare meaningful commit messages.

For n8n changes:

1. Define the UI event that triggers the workflow.
2. Define the payload contract.
3. Add signing, idempotency, and correlation strategy.
4. Document workflow steps.
5. Document failure and retry behavior.
6. Document deployment and rollback.
7. Validate end-to-end in staging where possible.

---

## Commit Style

Use Conventional Commits.

Examples:

- `feat(portfolio): add privacy-gated contact reveal`
- `feat(i18n): add bilingual EN and PT resources`
- `feat(n8n): document contact workflow payload contracts`
- `test(privacy-gate): cover unlock validation and locale persistence`
- `docs(ops): add n8n rollback and outage runbooks`
- `perf(landing): lazy-load non-critical case study sections`

Do not include meta-comments such as:

- `Generated by Claude`
- `Co-authored-by Claude`
- `AI-generated`

---

## Final Response Format

When finished, respond with:

1. Summary of implemented changes
2. Files changed
3. Commands run
4. Test/build results
5. Remaining risks or placeholders
6. Suggested next commit message

Keep the response direct, practical, and honest.
