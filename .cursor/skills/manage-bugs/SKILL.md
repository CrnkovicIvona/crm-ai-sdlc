---
name: manage-bugs
description: Manage bug lifecycle and trigger RCA when required. Use when a defect is found during testing, QA, or production.
---

# Manage bugs

## Lifecycle

`New` → `Triaged` → `Ready` → `In progress` (`bugfix/<bug-id>-<description>`) → `Fixed` (PR to `test`) → `Verified` → `Closed` (or `Reopened`)

## Steps

1. Create `docs/bugs/<bug-id>.md` from the template. Link TC, AC, and Issue.
2. Set severity/priority. High/Critical and production escapes require RCA (`docs/sdlc/root-cause-analysis.md`).
3. Do not start a bugfix on `main`.
4. After fix, verification must use `execute-tests` with evidence.

## Done

Bug record exists, owner/state clear, RCA attached when required.
