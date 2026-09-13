---
name: plan-tests
description: Design test cases and a risk-based test plan. After BDD. Do not execute tests here.
---

# Plan tests

New work: `docs/features/<ID>/test-cases.md` and `test-plan.md`.

Use `docs/sdlc/risk-model.md`, `docs/sdlc/risk-based-testing.md`, and
the ISTQB design rules in `docs/sdlc/testing-strategy.md`.

Templates: `docs/test-cases/TEMPLATE.md`, `docs/test-plans/TEMPLATE.md`.

## Rules

- Do not invent product behavior as extra tests (no new oracles).
- **ISTQB CTFL (black-box, from approved AC/FS/BD only):**
  For each AC, design at least:
  - **Positive (P)** — valid / allowed path
  - **Negative (N)** — forbidden role or invalid input **already specified**
  - **Edge (E)** — boundary or state **only if** FS/BD names a limit
    (length, unique, soft-delete, optional empty)
    Name the **technique** on the TC: EP, BVA, use-case, decision
    (role × action), state (active vs deleted).
- If the expected result is not in FS/BD/AC: status **BLOCKED**
  (`TBD — HUMAN`). Never treat BLOCKED as PASSED. Never invent copy
  or matching rules to “fill” N/E.
- For features that will ship, identify production smoke cases
  (critical post-deploy paths) to add under `tests/smoke/` when e2e
  exists. Do not copy the entire e2e pack.
- Tests in this skill are **DESIGNED**, not EXECUTED.
- High: include authz, RLS-when-present, destructive ops, audit if
  in FS; security review before later READY_FOR_PR.
- After TCs, update traceability, then technical spec if missing.

## Automation quality (for later implementation)

When TCs are later automated under `PLANNED`, the implementation plan
and `tests/` must follow this (same AC, no new oracles):

- **One TC id → one automated case** (`test()` / `it()`). Do not
  group CRUD or VIEWER read/search/deny into a single case. Setup
  (create a row) may repeat per case.
- Put P/N/E on the cheapest honest level (unit BVA, integration RLS,
  e2e use-case). Do not copy the full e2e pack as smoke.
- Missing schema or High-pack preconditions: **FAIL**, not skip-to-green.
  Skip only documented secrets (`E2E_*` / `VITE_*`); skip ≠ pass.
- BLOCKED oracles stay BLOCKED (do not invent search-match, copy, or
  extra formats). A search **UI** case may exist without a match rule.
- New increment: **add** TCs and files. Do not delete the prior pack
  to pass CI. Regression **runs** the old pack (`risk-based-testing.md`).
- Change to an approved AC updates BDD + that TC (`change-control.md`);
  it is not permission to drop coverage.

## Done

A human can see which tests will run, which are BLOCKED without an
oracle, and which will not run (skip vs not in scope).
