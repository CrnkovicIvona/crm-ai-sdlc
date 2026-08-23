# REL-###: Title

- Source: `test` SHA
- Target: `main`
- Date:
- Human approver:
- Smoke: not executed | executed — FAIL | executed — PASSED

## Changes

## Risk

## Test report

## Production smoke

Name the executable files (usually `tests/smoke/<rel-id>.spec.ts`).
Do not treat a markdown list as PASSED.

- Command: `SMOKE_BASE_URL=<production-origin> npm run test:smoke`
- CI: `.github/workflows/production-smoke.yml`
- Secrets: `E2E_*` as required by the suite (missing = FAIL)
- Manual checks remaining (if any):

| #   | Smoke test | Result | Evidence |
| --- | ---------- | ------ | -------- |

Overall: **not executed** until the command/CI job has run against
Production.

## Rollback
