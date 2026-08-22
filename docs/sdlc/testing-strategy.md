# Testing strategy

## Layers (when the application exists)

| Layer           | Tool       | Location                                             |
| --------------- | ---------- | ---------------------------------------------------- |
| Unit            | Vitest     | `tests/unit/` (and colocated tests if later adopted) |
| Integration     | Vitest     | `tests/integration/`                                 |
| End-to-end      | Playwright | `tests/e2e/`                                         |
| Static analysis | ESLint     | application source (not yet present)                 |
| Format          | Prettier   | entire repo                                          |
| Secrets         | gitleaks   | CI                                                   |

## Current phase

No application `src/` exists. AUTH-001 is `SPECIFIED` (not Ready).
CRM-001 is specified under `docs/features/CRM-001/` (not Ready, not
implemented).

There is **no application**. Do not add fake passing Vitest or
Playwright tests. Foundation CI runs Prettier, commitlint, and secret
scanning only.

CI must report each suite as one of:

- **PASSED** — executed and succeeded, with evidence
- **FAILED** — executed and failed
- **SKIPPED** — GitHub skipped the job (not executed)
- **NOT APPLICABLE** — cannot run yet (no `src/`); GitHub shows the
  ESLint, Vitest, and Playwright jobs as **SKIPPED**

NOT APPLICABLE and SKIPPED are not PASSED.

## ESLint strategy (deferred configuration)

When `src/` is introduced:

- Use ESLint flat config (`eslint.config.js`) with TypeScript and React
  plugins for Vite + React (ADR-0002)
- Wire `npm run lint` into CI as a **required** job
- Do not enable `continue-on-error` on lint
- Keep Prettier for formatting; avoid conflicting stylistic ESLint rules

Until then, ESLint is documented only — not a fake gate.

## Execution vs healing

- `execute-tests` runs tests and stores evidence
- `heal` diagnoses and remediates
- A test is **passed** only if it was actually executed and verifiable
  evidence exists for that execution (local output or CI log for the
  relevant SHA)

## Risk-based scope

See [risk-based-testing.md](risk-based-testing.md). Trivial docs changes
do not require full e2e regression.

## Environment

E2E against Vercel Preview/`test` when connected. Production smoke is
separate and requires a production URL plus human release.
