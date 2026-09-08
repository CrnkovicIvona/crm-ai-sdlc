---
name: heal
description: Diagnose test or CI failures and remediate without weakening quality gates. Use when state is HEALING. Do not claim tests passed; execute-tests must re-run them.
---

---

name: heal
description: Diagnose test or CI failures and remediate without weakening quality gates. Use when state is HEALING, when GitHub Actions fails on this branch, or when Vitest reports "Test timed out". Do not claim tests passed; execute-tests or a new CI run must re-run them.
---

# Heal

## Responsibility

**Failure diagnosis and remediation only.** Do not record a pass. After a fix, return to `execute-tests` for the affected tests (or push and wait for CI when the failure was CI-only).

When CI fails on a branch this agent owns, **start this skill without waiting for the human to ask**.

## Rules

- Do not delete, skip, or weaken tests to make CI pass.
- Do not disable lint or required GitHub Actions jobs.
- Do not change acceptance criteria to match a bug.
- Prefer fixing product code. Fix tests only when the test is wrong relative to approved AC, or when the harness (timeout, formatter) is wrong relative to a still-valid AC.
- If the failure is environmental, document it; do not mark the test passed.

## Classify the log first

Read the failed GitHub Actions job (or local runner) before editing.

| Signal                                                                                                            | Meaning                                           | Remediation                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Test timed out in 5000ms` (or default timeout) on `tests/integration/` while other cases in the same file passed | Live Supabase round-trips exceeded Vitest default | Set integration `testTimeout` and `hookTimeout` to **at least 20s** in `vitest.config.ts` (project `integration`). Keep every `expect`. Do **not** `skipIf(true)` |
| `expect(...)` / RLS row appeared when it should not                                                               | Product or policy vs AC                           | Fix `src/` or SQL **as planned**; do not loosen the test                                                                                                          |
| Prettier / format:check                                                                                           | Formatting                                        | `npx prettier --write` on the reported files; do not disable the job                                                                                              |
| Integration/e2e skipped, missing `VITE_SUPABASE_*` / `E2E_*` / `SUPABASE_SERVICE_ROLE_KEY`                        | Secrets                                           | **BLOCKED**; name the variables; skip ≠ pass                                                                                                                      |
| Production smoke skipped on a docs PR                                                                             | Not a prod deploy                                 | SKIPPED; do not treat as PASSED                                                                                                                                   |

Timeout is **not** an assertion failure. Do not “heal” it by deleting TC-C012–C019.

## Steps

1. Read the failing evidence (`gh run view --log`, Actions URL, SHA).
2. Classify using the table above.
3. If it is a product defect, open/update a bug via `manage-bugs` when severity warrants.
4. Apply the smallest remediation that preserves AC.
5. Push if this is a PR branch; subscribe to CI or re-run the suite.
6. Do not re-label the suite as passed until a **new** execution is green.

## Done

A change exists **or** a documented blocker exists. Passing status is not this skill's output.
