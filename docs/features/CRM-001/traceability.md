# CRM-001 traceability

Chain: REQ → FR → US → AC → BDD → TC → TDE → Implementation →
Verification.

Implementation paths are filled. Automated tests exist on this branch.
Verification is **not PASSED**. SKIPPED ≠ PASSED. This remediation
did not execute credentialed suites.

| REQ         | FR      | US      | AC      | BDD                                  | TC      | TDE                | Implementation | Verification                                                                                 |
| ----------- | ------- | ------- | ------- | ------------------------------------ | ------- | ------------------ | -------------- | -------------------------------------------------------------------------------------------- |
| REQ-CRM-001 | FR-C001 | US-C001 | AC-C001 | Client is the only CRM entity        | TC-C001 | TDE-C001           | see matrix.md  | AUTOMATED `tests/e2e/clients.spec.ts` — NOT EXECUTED                                         |
| REQ-CRM-001 | FR-C002 | US-C001 | AC-C002 | Client has the approved fields       | TC-C002 | TDE-C001           | see matrix.md  | AUTOMATED e2e (five field errors) + `tests/unit/clientValidation.test.ts` — NOT EXECUTED     |
| REQ-CRM-001 | FR-C003 | US-C002 | AC-C003 | ADMIN can read Clients               | TC-C003 | TDE-C002, TDE-C003 | see matrix.md  | AUTOMATED e2e — NOT EXECUTED (needs `E2E_*`; skip ≠ pass)                                    |
| REQ-CRM-001 | FR-C003 | US-C002 | AC-C004 | ADMIN can create a Client            | TC-C004 | TDE-C002, TDE-C003 | see matrix.md  | AUTOMATED e2e — NOT EXECUTED (needs `E2E_*` + migrations)                                    |
| REQ-CRM-001 | FR-C003 | US-C002 | AC-C005 | ADMIN can update a Client            | TC-C005 | TDE-C002, TDE-C003 | see matrix.md  | AUTOMATED e2e — NOT EXECUTED                                                                 |
| REQ-CRM-001 | FR-C003 | US-C002 | AC-C006 | ADMIN can delete a Client            | TC-C006 | TDE-C002, TDE-C003 | see matrix.md  | AUTOMATED e2e — NOT EXECUTED                                                                 |
| REQ-CRM-001 | FR-C004 | US-C003 | AC-C007 | VIEWER can read Clients              | TC-C007 | TDE-C002, TDE-C003 | see matrix.md  | AUTOMATED e2e — NOT EXECUTED                                                                 |
| REQ-CRM-001 | FR-C004 | US-C003 | AC-C008 | VIEWER can search Clients            | TC-C008 | TDE-C002           | see matrix.md  | AUTOMATED e2e — NOT EXECUTED                                                                 |
| REQ-CRM-001 | FR-C004 | US-C003 | AC-C009 | VIEWER cannot create a Client        | TC-C009 | TDE-C006           | see matrix.md  | AUTOMATED e2e UI + integration RLS — NOT EXECUTED                                            |
| REQ-CRM-001 | FR-C004 | US-C003 | AC-C010 | VIEWER cannot update or delete       | TC-C010 | TDE-C006           | see matrix.md  | AUTOMATED e2e UI (no write controls) + integration RLS — NOT EXECUTED                        |
| REQ-CRM-001 | FR-C005 | US-C003 | AC-C011 | VIEWER sees all Client fields        | TC-C011 | TDE-C002           | see matrix.md  | AUTOMATED e2e (grouped with C007–C011; detail fields not separately asserted) — NOT EXECUTED |
| REQ-CRM-001 | FR-C006 | US-C004 | AC-C012 | Database authorization boundary      | TC-C012 | TDE-C003, TDE-C006 | see matrix.md  | AUTOMATED `tests/integration/clients-rls.test.ts` — NOT EXECUTED (skip unless live)          |
| REQ-CRM-001 | FR-C007 | US-C005 | AC-C013 | Successful create is audited         | TC-C013 | TDE-C004           | see matrix.md  | AUTOMATED integration — NOT EXECUTED                                                         |
| REQ-CRM-001 | FR-C008 | US-C005 | AC-C014 | Update audited with values           | TC-C014 | TDE-C004           | see matrix.md  | AUTOMATED integration — NOT EXECUTED                                                         |
| REQ-CRM-001 | FR-C009 | US-C005 | AC-C015 | Successful delete is audited         | TC-C015 | TDE-C004           | see matrix.md  | AUTOMATED integration — NOT EXECUTED                                                         |
| REQ-CRM-001 | FR-C010 | US-C005 | AC-C016 | Audit record has required attributes | TC-C016 | TDE-C004           | see matrix.md  | AUTOMATED integration — NOT EXECUTED                                                         |
| REQ-CRM-001 | FR-C011 | US-C006 | AC-C017 | Users cannot change audit records    | TC-C017 | TDE-C005           | see matrix.md  | AUTOMATED integration — NOT EXECUTED                                                         |
| REQ-CRM-001 | FR-C012 | US-C005 | AC-C018 | Read is not audited                  | TC-C018 | TDE-C004           | see matrix.md  | AUTOMATED integration — NOT EXECUTED                                                         |
| REQ-CRM-001 | FR-C013 | US-C005 | AC-C019 | Unauthorized attempt is not audited  | TC-C019 | TDE-C004           | see matrix.md  | AUTOMATED integration — NOT EXECUTED                                                         |
| REQ-CRM-001 | FR-C014 | US-C007 | AC-C020 | Fixed Product catalog                | TC-C020 | TDE-C001           | see matrix.md  | AUTOMATED unit `tests/unit/products.test.ts` + e2e checkbox — NOT EXECUTED                   |
| REQ-CRM-001 | FR-C015 | US-C007 | AC-C021 | Optional product assignment          | TC-C021 | TDE-C002, TDE-C003 | see matrix.md  | AUTOMATED e2e (assign on create) + integration — NOT EXECUTED                                |
| REQ-CRM-001 | FR-C016 | US-C002 | AC-C022 | Soft-delete hides Client             | TC-C022 | TDE-C002, TDE-C003 | see matrix.md  | AUTOMATED e2e (search after delete) — NOT EXECUTED                                           |

Also index in [../../traceability/matrix.md](../../traceability/matrix.md).
AUTH-001 fail-closed reused as TDE-C007 (not duplicated as a CRM FR).
