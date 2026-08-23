# Testing strategy

## Layers (when the application exists)

| Layer            | Tool       | Location                                             |
| ---------------- | ---------- | ---------------------------------------------------- |
| Unit             | Vitest     | `tests/unit/` (and colocated tests if later adopted) |
| Integration      | Vitest     | `tests/integration/`                                 |
| End-to-end       | Playwright | `tests/e2e/` (local Vite; `playwright.config.ts`)    |
| Production smoke | Playwright | `tests/smoke/` (`playwright.smoke.config.ts`)        |
| Static analysis  | ESLint     | `eslint.config.js` (`src/` and repo config)          |
| Format           | Prettier   | entire repo                                          |
| Secrets          | gitleaks   | CI                                                   |

## Quality bar

**Now (`src/` present for AUTH-001):** Prettier
(`npm run format:check`), Conventional Commits (commitlint on pull
requests), gitleaks in CI, EditorConfig, required ESLint, Vitest, and
Playwright per test plan and risk. Do not weaken or skip these jobs
to obtain a green build. Credentialed e2e SKIPPED without secrets is
not PASSED.

Do not add `continue-on-error: true` to required workflows. Do not
delete assertions to pass CI.

Agent constraints: `.cursor/rules/quality.mdc`. The file
[quality.md](quality.md) is a pointer only.

## Current phase

AUTH-001 is **`RELEASED`** on **`main`** (REL-003). Production
smoke **PASSED** 2026-08-23: **5/5** against
`https://crm-ai-sdlc.vercel.app` (`npm run test:smoke`, `workers: 1`;
PO dropped former 1b). Vitest and unauthenticated Playwright ran (see
[docs/test-reports/AUTH-001.md](../test-reports/AUTH-001.md)). Live
Auth Playwright cases remain **SKIPPED** until `E2E_*` /
`VITE_SUPABASE_*` are set (skipped ≠ passed).

CRM-001 is **specified and implemented on the feature branch**
(`docs/features/CRM-001/`, `src/` Client screens, automated tests).
It is **not** `RELEASED`. Credentialed CRM e2e and RLS integration
are SKIPPED without secrets (skipped ≠ passed). DASH-001 is not
started.

When a feature requirement is defined, acceptance criteria must name
the **critical production smoke scenarios** where they apply (the
paths that must still work after a production deploy). When Playwright
e2e tests are created, identify and add the matching smoke tests in
`tests/smoke/` — do not duplicate the full e2e suite. Release notes
must reference those files and record execution results.

CI must report each suite as one of:

- **PASSED** — executed and succeeded, with evidence
- **FAILED** — executed and failed
- **SKIPPED** — GitHub skipped the job (not executed)
- **NOT APPLICABLE** — cannot run yet (no `src/`); GitHub shows the
  ESLint, Vitest, and Playwright jobs as **SKIPPED**

NOT APPLICABLE and SKIPPED are not PASSED.

## ESLint

Flat config in `eslint.config.js` (TypeScript + React, ADR-0002).
`npm run lint` is a required CI job when `src/` is present. Do not
enable `continue-on-error` on lint. Prettier owns formatting.

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

E2E against local Vite (`npm run test:e2e`) and Vercel Preview/`test`
when connected. Production smoke is a **separate** category: it does
not start a webServer, requires `SMOKE_BASE_URL`, and uses documented
test accounts via `E2E_*` secrets. Run `npm run test:smoke`. CI:
`.github/workflows/production-smoke.yml` after Production deploy
(`deployment_status`) or `workflow_dispatch`. Missing `SMOKE_BASE_URL`
or `E2E_*` is **FAIL**, not SKIPPED.
