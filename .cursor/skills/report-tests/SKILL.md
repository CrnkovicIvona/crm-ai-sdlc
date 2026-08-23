---
name: report-tests
description: Write a test report from execution evidence. Use after TESTING/REGRESSION and before READY_FOR_PR. Never invent pass results.
---

# Report tests

## Rules

- Every passed line must cite execution evidence (command + SHA or CI URL).
- Tests not executed are `not executed`, never `passed`.
- Include risk level and regression scope actually run.
- After CI Playwright, `scripts/update-ci-test-report.mjs` refreshes
  `docs/test-reports/<ID>.md` when the SHA or counts change. It keeps the
  previous snapshot under **Historical snapshot**. SKIPPED ≠ PASSED.
  Do not hand-edit **Latest CI**; wait for the next Actions run or run
  the script locally with a JSON file.

## Steps

1. Read `docs/test-plans/<id>.md` and evidence from `execute-tests`.
2. Fill `docs/test-reports/<id>.md` from the template.
3. List residual risk and open bugs.
4. Update traceability with automated test paths only when those tests exist and were run.

## Done

A human can audit what ran, what did not, and why.
