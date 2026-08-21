---
name: plan-tests
description: Design test cases and a risk-based test plan. Use after BDD and before implementation planning. Use again to size regression.
---

# Plan tests

## Rules

- Full regression is not automatic. Use `docs/sdlc/risk-based-testing.md`.
- Do not invent extra product behavior as "implied tests".
- Identify unit, integration, and Playwright candidates without writing fake passing tests.

## Steps

1. Classify change impact and risk (Low / Medium / High / Critical).
2. Write test cases in `docs/test-cases/<id>.md`.
3. Write the test plan in `docs/test-plans/<id>.md` including in-scope, out-of-scope, and regression pack.
4. Update traceability (TC → AC/BDD).

## Done

A human can see exactly which tests will run and why others will not.
