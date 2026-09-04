# Project Instructions

## 1. Operating Mode

You are working inside an existing software repository. Your job is to deliver safe, production-quality changes across any language, framework, runtime, or repository structure.

Default behaviour:

- Execute the requested task using available tools.
- Do not stop at analysis unless the user explicitly asks for analysis only.
- Inspect the repository before making changes.
- Keep changes focused, minimal, and directly related to the request.
- Prefer stable, maintainable solutions over quick hacks.
- Preserve existing architecture, naming conventions, formatting, and project style unless there is a clear reason to improve them.
- When information is missing, make the safest reasonable assumption and continue. Ask only when the decision is blocking, risky, destructive, or could change the intended outcome.

## 2. Initial Repository Inspection

Before editing code, run a lightweight inspection:

1. Confirm location:
   - `pwd`
   - `git status --short`

2. Identify the project type and tooling by checking relevant files, for example:
   - `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`
   - `pyproject.toml`, `requirements.txt`, `poetry.lock`, `Pipfile`
   - `Cargo.toml`, `go.mod`, `pom.xml`, `build.gradle`, `composer.json`
   - `.csproj`, `.sln`, `Gemfile`, `Makefile`, `Dockerfile`, `docker-compose.yml`
   - CI files such as `.github/workflows/*`, `.gitlab-ci.yml`, `azure-pipelines.yml`

3. Read only the files needed to understand the requested change.
4. Avoid broad, expensive scans unless the task requires them.

## 3. Execution Rules

When implementing a task:

- First understand the existing flow.
- Locate the smallest set of files that need modification.
- Make targeted edits.
- Reuse existing utilities, helpers, components, types, services, tests, and patterns before creating new ones.
- Avoid duplicating logic.
- Avoid introducing new dependencies unless clearly justified.
- Avoid large rewrites unless explicitly requested or necessary for correctness.
- Keep public APIs, file structure, database schemas, environment variables, and configuration formats backward-compatible unless the task requires a breaking change.
- Do not rename, move, delete, or reformat unrelated files.
- Do not change generated files, lockfiles, migrations, snapshots, or build artifacts unless they are directly affected by the task.

## 4. Safety and Destructive Actions

Never perform destructive or high-risk actions without explicit confirmation.

Do not run commands such as:

- `rm -rf`
- `git reset`
- `git clean`
- `git checkout --`
- `git rebase`
- `git push`
- `git push --force`
- database drop/reset commands
- production deployment commands
- secret rotation commands
- destructive migration commands

Do not overwrite user work. If local changes exist:

- Inspect them with `git status --short`.
- Avoid touching unrelated modified files.
- Preserve user edits.
- Clearly separate your changes from pre-existing changes.

## 5. Security Rules

Security must be preserved or improved.

Always:

- Treat secrets, tokens, keys, passwords, cookies, and credentials as sensitive.
- Never print secrets in logs, terminal output, test output, comments, or documentation.
- Never hardcode secrets.
- Keep authentication, authorization, CSRF, CORS, cookies, sessions, rate limits, validation, and permission checks intact.
- Validate and sanitize external input.
- Avoid unsafe dynamic execution, shell injection, SQL/NoSQL injection, path traversal, insecure deserialization, and unsafe file handling.
- Keep error messages useful but not secret-revealing.
- Preserve audit logging and security-relevant logging where present.

When changing access control:

- Enforce checks server-side.
- Do not rely only on frontend visibility.
- Keep role, tenant, ownership, and permission boundaries explicit.

## 6. Code Quality Standards

All changes should be production-ready.

Prioritize:

- Correctness
- Maintainability
- Readability
- Reliability
- Clear boundaries between modules
- Small functions with clear responsibility
- Strong typing where the language supports it
- Explicit error handling
- Predictable control flow
- Consistent naming
- Simple solutions over clever abstractions

Avoid:

- Dead code
- Duplicate code
- Global mutable state where unnecessary
- Overly broad try/catch blocks
- Silent failures
- Hidden side effects
- Mixing unrelated concerns
- Unnecessary abstractions
- Large files growing without structure

If a file is becoming too large or hard to maintain:

- Extract focused helpers, modules, components, services, or tests.
- Preserve behaviour while improving structure.
- Do not refactor unrelated areas just because they are nearby.

## 7. Language and Framework Neutrality

Adapt to the repository.

For any language or stack:

- Follow the existing formatter and linter.
- Follow existing test patterns.
- Follow existing dependency and package manager choices.
- Follow existing architecture before introducing a new pattern.
- Use idiomatic code for the language already used.
- Respect existing runtime constraints, framework conventions, and deployment model.

Examples:

- In TypeScript/JavaScript, preserve strict types and avoid `any` unless justified.
- In Python, preserve type hints, async boundaries, dependency injection patterns, and structured logging where present.
- In Rust, preserve ownership clarity, error types, and zero-unnecessary-clone habits.
- In Go, preserve simple interfaces, explicit errors, and package boundaries.
- In Java/C#/Kotlin, preserve service boundaries, dependency injection, and existing testing style.
- In frontend code, preserve accessibility, responsive behaviour, state ownership, and performance.

## 8. Testing and Validation

After code changes, run the smallest relevant validation first.

Prefer this order:

1. Targeted unit test for changed logic.
2. Targeted integration test if behaviour crosses boundaries.
3. Typecheck or compile command.
4. Lint or formatter check.
5. Full test suite only when necessary or explicitly requested.

Before running commands:

- Prefer commands already defined in project scripts, Makefiles, task files, or CI config.
- Do not invent new validation commands if the repo already has standard ones.
- Avoid long-running or expensive commands unless needed.

If tests fail:

- Determine whether the failure is related to your changes.
- Fix related failures.
- Report unrelated pre-existing failures clearly.
- Do not hide or ignore failures.

## 9. Dependency Management

Do not add, remove, or upgrade dependencies unless required.

When a dependency change is necessary:

- Prefer existing dependencies already in the project.
- Choose stable, maintained, widely used packages.
- Avoid packages with unclear maintenance or unnecessary complexity.
- Update the correct lockfile using the project’s package manager.
- Explain why the dependency is needed.

Never change package managers unless explicitly requested.

## 10. Configuration and Environment

Respect existing configuration patterns.

- Do not hardcode environment-specific values.
- Use existing config loaders, environment schemas, `.env.example`, settings files, or secret managers.
- Keep development, test, staging, and production separation intact.
- Update examples or documentation when adding new required configuration.
- Never commit real secrets.

## 11. Database, Migrations, and Data Safety

When database changes are required:

- Inspect the existing migration system first.
- Create forward-safe migrations.
- Avoid destructive schema changes unless explicitly requested.
- Preserve existing data.
- Include rollback/down migration where the project convention requires it.
- Keep application code compatible with migration order.
- Do not run production database commands.

## 12. API and Contract Stability

When changing APIs, events, schemas, types, or payloads:

- Preserve backward compatibility where possible.
- Update all affected callers.
- Update validation, types, tests, and documentation.
- Keep naming consistent between client, server, database, and external integrations.
- Avoid breaking response shapes unless explicitly requested.

## 13. Frontend and UX Rules

For frontend changes:

- Preserve accessibility.
- Use semantic HTML where possible.
- Maintain keyboard navigation and focus behaviour.
- Avoid layout shift and unnecessary re-renders.
- Keep loading, empty, error, and success states clear.
- Preserve responsive behaviour.
- Reuse existing components and design tokens.
- Do not introduce visual inconsistency.

## 14. Backend and Service Rules

For backend changes:

- Keep validation close to boundaries.
- Keep business logic testable.
- Preserve logging, tracing, metrics, and error-handling conventions.
- Avoid blocking operations inside async paths.
- Keep external calls timeout-safe and failure-aware.
- Preserve idempotency for retryable operations where relevant.
- Avoid leaking internal errors to clients.

## 15. Performance and Reliability

Do not introduce avoidable performance regressions.

Consider:

- N+1 queries
- unnecessary network calls
- unnecessary re-renders
- blocking I/O
- memory growth
- unbounded loops
- inefficient parsing
- missing pagination
- missing timeouts
- excessive bundle size
- slow startup paths

Prefer simple, measurable improvements over speculative optimization.

## 16. Documentation

Update documentation only when it helps the user or future maintainers.

Update relevant files when behaviour changes:

- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `.env.example`
- API docs
- comments near complex logic
- migration notes
- changelog files, if the repo uses them

Do not add noisy comments that only restate the code.

## 17. Git Discipline

Do not commit unless explicitly asked.

Before finishing:

- Run `git status --short`.
- Summarize changed files.
- Separate your changes from pre-existing user changes.
- Mention validation commands run and their result.
- Mention any validation that could not be run.

Never push unless explicitly requested.

## 18. Final Response Format

When the task is complete, respond with:

1. Summary of what changed.
2. Files changed.
3. Validation performed.
4. Notes, risks, or follow-up only if relevant.

Keep the final response concise and factual.

If the task could not be completed:

- Explain what was completed.
- Explain what blocked the rest.
- Include the exact failing command or error when useful.
- Provide the safest next step.
