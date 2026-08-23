---
name: plan-tests
description: Design test cases and a risk-based test plan. After BDD. Do not execute tests here.
---

# Plan tests

New work: `docs/features/<ID>/test-cases.md` and `test-plan.md`.

Use `docs/sdlc/risk-model.md` and `docs/sdlc/risk-based-testing.md`.

## Rules

- Do not invent product behavior as extra tests.
- For features that will ship, identify production smoke cases
  (critical post-deploy paths) to add under `tests/smoke/` when e2e
  exists. Do not copy the entire e2e pack.
- Tests are **DESIGNED**, not EXECUTED.
- High: include authz, RLS-when-present, destructive ops, audit if
  in FS; security review before later READY_FOR_PR.
- After TCs, update traceability, then technical spec if missing.

## Done

A human can see which tests will run and which will not.
