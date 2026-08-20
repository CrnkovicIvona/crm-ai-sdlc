---
name: heal
description: Diagnose test or CI failures and remediate without weakening quality gates. Use when state is HEALING. Do not claim tests passed; execute-tests must re-run them.
---

# Heal

## Responsibility

**Failure diagnosis and remediation only.** Do not record a pass. After a fix, return to `execute-tests` for the affected tests.

## Rules

- Do not delete, skip, or weaken tests to make CI pass.
- Do not disable lint or required GitHub Actions jobs.
- Do not change acceptance criteria to match a bug.
- Prefer fixing product code. Fix tests only when the test is wrong relative to approved AC.
- If the failure is environmental, document it; do not mark the test passed.

## Steps

1. Read the failing evidence from `execute-tests` (command, log, SHA).
2. Identify likely cause (product defect, test defect, fixture, environment, flake).
3. If it is a product defect, open/update a bug via `manage-bugs` when severity warrants.
4. Apply the smallest remediation that preserves AC.
5. Do not re-label the suite as passed.
6. Hand back to `execute-tests`.

## Done

A change exists **or** a documented blocker exists. Passing status is not this skill's output.
