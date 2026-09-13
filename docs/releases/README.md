# Releases

Use [TEMPLATE.md](TEMPLATE.md). Agent prepares notes; human merges to
`main` and deploys.

| Release               | Title                                                     | Status                                                    |
| --------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| [REL-001](REL-001.md) | Project Foundation                                        | Merged to `main` (PR #2)                                  |
| [REL-002](REL-002.md) | Git workflow sync (`test` equals `main`)                  | Merged to `main` (PR #4)                                  |
| [REL-003](REL-003.md) | AUTH-001 login, roles, fail-closed                        | **RELEASED** (PR #12 + smoke 5/5 PASS; close-out PR)      |
| [REL-004](REL-004.md) | CRM-001 clients, products, soft-delete                    | Product on `main`; CRM **`RELEASED`** after REL-005 smoke |
| [REL-005](REL-005.md) | Promote `test` (apply-schema, README, CRM test isolation) | **RELEASED** path: PR #35/#36 + smoke 7/7 PASS            |
