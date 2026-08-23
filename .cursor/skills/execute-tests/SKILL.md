---
name: execute-tests
description: Execute planned tests and capture verifiable evidence. Use in TESTING and REGRESSION. Do not diagnose or change code to fix failures (use heal).
---

# Execute tests

## Responsibility

Run the tests in the current test plan scope and **record evidence**. Do not implement product fixes here. Do not "heal" failures here. If failures occur, set state to `HEALING` and invoke `heal`.

## No fabrication (mandatory)

Never report a test as passed unless:

1. It was actually executed in this session or in CI for this commit/SHA, and
2. Verifiable execution evidence exists (command output, CI job log URL, or a stored report that cites that output).

If a suite was not run (no application, no runner, skipped by risk plan), say **NOT EXECUTED** or **SKIPPED** / **NOT APPLICABLE** and why. Do not equate those with **PASSED**. Designed tests in `docs/` are **DESIGNED** until this skill runs.

## Steps

1. Read the test plan and risk scope (targeted vs regression).
2. Run only the in-scope automated commands. Quote the exact commands.
   Production smoke is `npm run test:smoke` with `SMOKE_BASE_URL`; it
   is not `npm run test:e2e`.
3. Collect pass/fail/skip counts from the runner. Store paths to logs.
4. For manual cases, mark them pending unless the human recorded execution.
5. If any required test failed, stop execution of "all green" claims and hand off to `heal`.
6. If green, hand off to `report-tests` (or continue remaining regression batches).

## Evidence format

- Command
- Working directory
- Exit code
- Summary counts
- Artifact path or CI URL
- Git SHA
