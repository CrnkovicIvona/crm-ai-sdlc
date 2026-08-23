# Risk-based testing

Full regression is **not** the default. The test plan records scope.

## Impact

Identify what changed: docs, CI, tooling, UI, auth, data, payments,
personal data, infrastructure.

## Risk levels

| Level    | Examples (non-exhaustive)                            | Typical scope                                           |
| -------- | ---------------------------------------------------- | ------------------------------------------------------- |
| Low      | Typo, docs, comment, formatting                      | Prettier/commitlint; no full e2e                        |
| Medium   | Isolated UI or helper with no auth/data              | Unit + affected integration + smoke e2e when app exists |
| High     | Auth, authorization, customer data, financial fields | Full relevant suite + regression pack + security review |
| Critical | Production incident, security vuln, data loss path   | Full pack + RCA + human security/release gates          |

## Regression

Regression is a **planned subset** (or full pack) based on risk and
impact, described in `docs/test-plans/`. Skipping regression for High
or Critical risk requires human approval.

## Evidence

Unrun tests are `not executed`. They are never reported as passed.
**BLOCKED** (no oracle, or High suite not run for secrets) is also
never passed.
