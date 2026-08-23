# ISTQB QA review — Phase 55 + Phase 66

- Branch: `cursor/crm-001-implementation-73b9`
- Date: 2026-08-23
- Mode: ISTQB QA Review & Completion
- Scope: AUTH-001 + CRM-001 tests already on the branch
- No new features, roles, fields, validations, APIs, frameworks, or
  migrations. UI testids not renamed.
- SKIPPED ≠ PASSED. STOP after this report.

Evidence SHA for e2e: `1c98f14` CI
[32672184863](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/32672184863).
This commit is docs-only after that SHA.

---

# PHASE 55 — Review

## 1) Inventory

| Kind        | Path                                    | Role                              |
| ----------- | --------------------------------------- | --------------------------------- |
| Unit        | `tests/unit/errors.test.ts`             | TC-007 mapper                     |
| Unit        | `tests/unit/require-auth.test.ts`       | TC-001/002, AC-012, TC-009        |
| Unit        | `tests/unit/clientValidation.test.ts`   | TC-C002 P/N/E                     |
| Unit        | `tests/unit/products.test.ts`           | TC-C020                           |
| Integration | `tests/integration/clients-rls.test.ts` | TC-C012–C019, C021 DB             |
| E2E         | `tests/e2e/auth.spec.ts`                | TC-001,002,005,006,007,008        |
| E2E         | `tests/e2e/roles.spec.ts`               | TC-003,004,009                    |
| E2E         | `tests/e2e/clients.spec.ts`             | TC-C001–C011, C020–C022 (grouped) |
| Helper      | `tests/e2e/login.ts`                    | login/logout waits (not a TC)     |
| Smoke       | `tests/smoke/rel-003.spec.ts`           | REL-003 1–5; not TC PASSED        |
| Fixtures    | none (inline unique payloads)           | —                                 |

## 2) Mapping (file → TC → AC → spec → testid → code → status)

| Test file            | TC                  | AC                  | SPEC    | UX testid                                  | Code path              | Status                      | Notes                                       |
| -------------------- | ------------------- | ------------------- | ------- | ------------------------------------------ | ---------------------- | --------------------------- | ------------------------------------------- |
| auth.spec.ts         | 002,008             | AC-002,003,010      | FS AUTH | login-form, crm-shell                      | RequireAuth, LoginPage | FULL / PASSED CI            |                                             |
| auth.spec.ts         | 007                 | AC-009              | FS AUTH | login-email/password/submit, login-error   | errors.ts              | FULL / PASSED CI            |                                             |
| auth.spec.ts         | 001                 | AC-001,008          | FS AUTH | login-*, crm-shell                         | auth.ts                | FULL / PASSED CI            |                                             |
| auth.spec.ts         | 005,006             | AC-006,007          | FS AUTH | logout, login-form                         | auth.ts signOut local  | FULL / PASSED CI            |                                             |
| roles.spec.ts        | 003,009             | AC-004,011          | FS AUTH | user-role, admin-write-hint, client-create | AppShell               | FULL / PASSED CI            |                                             |
| roles.spec.ts        | 004,009             | AC-005,011          | FS AUTH | viewer-read-hint                           | AppShell               | FULL / PASSED CI            |                                             |
| require-auth.test.ts | AC-012              | AC-012              | FS AUTH | n/a                                        | access.ts              | FULL / PASSED unit          | no e2e                                      |
| errors.test.ts       | 007                 | AC-009              | FS AUTH | n/a                                        | errors.ts              | FULL / PASSED unit          |                                             |
| clients.spec.ts      | C001                | AC-C001             | FS CRM  | nav-clients                                | ClientListPage         | FULL / PASSED CI            |                                             |
| clients.spec.ts      | C002                | AC-C002             | FS CRM  | field-error-*                              | clientValidation.ts    | FULL / PASSED CI            |                                             |
| clients.spec.ts      | C003–C006,C021,C022 | AC-C003–006,021,022 | FS CRM  | client-_, product-bank_account, delete-_   | clients.ts             | FULL / PASSED CI            | grouped                                     |
| clients.spec.ts      | C007–C011           | AC-C007–011         | FS CRM  | client-create=0, client-search             | ClientListPage         | PARTIAL / PASSED grouped    | C008 match BLOCKED; C011 not field-by-field |
| clients-rls.test.ts  | C012–C019           | AC-C012–019         | FS CRM  | n/a                                        | SQL RLS/triggers       | WRITTEN / SKIPPED / BLOCKED | no service role                             |
| products.test.ts     | C020                | AC-C020             | FS CRM  | n/a                                        | products.ts            | FULL / PASSED unit          |                                             |
| rel-003.spec.ts      | overlap 001–008     | AUTH smoke          | REL-003 | same freeze                                | —                      | smoke; this SHA job SKIPPED | not TC PASSED                               |

## 3) ISTQB analysis

See matrices in `docs/test-cases/AUTH-001.md` and
`docs/features/CRM-001/test-cases.md`. All High except C011/C018/C019/C020
Medium. Techniques: use-case, EP, BVA, decision, state.

## 4) Missing TC fields

Filled on AUTH TCs (already present) and CRM TCs: preconditions, steps,
test data, expected, technique, level, priority. No invented oracles
(C008 match, extra formats remain BLOCKED).

## 5) UX testids

Playwright IDs match `src/` freeze. `ui-ux-proposal.md` “Must not
change” list updated to those IDs (was stale `product-bank_account` /
`field-error-first_name`). **No src testid renamed.**

## 6) RLS / audit

Automation in `clients-rls.test.ts`: VIEWER CUD denied; CREATE/UPDATE
(old/new)/DELETE audit; actor_id; occurred_at; append-only; READ not
audited; failed VIEWER write not audited; product assign RLS.
**6 skipped** local+CI → **BLOCKED**. SKIPPED ≠ PASSED.

## 7) AUTH

Login, logout, unauth, ADMIN, VIEWER, fail-closed missing profile
(unit), protected `/app`, generic error: **PASSED** CI e2e/unit
(`1c98f14`). Feature remains RELEASED.

## 8) CRM

CRUD, soft-delete, search UI, validation empty-submit, catalog
checkbox, assign-on-create, ADMIN/VIEWER UI: **PASSED** CI e2e.
DB permissions: **BLOCKED**.

## 9) Traceability

REQ→FR→AC→TC→TEST→CODE: docs updated. EVIDENCE: e2e/unit yes; RLS no.

## 10) Execution (this agent)

| Suite                   | Result                                                         |
| ----------------------- | -------------------------------------------------------------- |
| `npm test`              | WRITTEN, AUTOMATED, EXECUTED: 13 PASSED, 6 SKIPPED (RLS)       |
| Playwright local        | NOT EXECUTED (no `VITE_SUPABASE_*`; E2E set would fail-closed) |
| Playwright CI `1c98f14` | EXECUTED 11 PASSED, 0 skipped                                  |
| Smoke this SHA          | SKIPPED job                                                    |
| RLS                     | SKIPPED → BLOCKED                                              |

---

# PHASE 66 — Final ISTQB QA report

## A. Coverage summary

| Area             | Written                   | Executed | Verdict            |
| ---------------- | ------------------------- | -------- | ------------------ |
| AUTH UI/e2e/unit | yes                       | yes CI   | PASSED this branch |
| CRM UI/e2e/unit  | yes                       | yes CI   | PASSED this branch |
| RLS / audit      | yes                       | no       | BLOCKED            |
| UX testids       | freeze = src = Playwright | —        | aligned            |

## B. Missing tests (SPEC-required only)

None missing as **files**. Live AC-012 e2e was explicitly dropped
(TC-010). C008 match test **must not** be added until BD oracle.
profiles RLS pack **not** in AUTH TC list.

## C. Tests corrected

- AUTH/CRM TC cards: ISTQB fields (preconditions, data, steps,
  expected, technique, level, priority).
- UX proposal freeze list aligned to actual testids (docs only).
- Stale “RLS later PLANNED” wording on C012 replaced with execute
  BLOCKED without secrets.

## D. Tests added

**None** (no new spec, no new `tests/**` files).

## E. Execution results

- Vitest: 13 PASSED, 6 SKIPPED
- Playwright: 11 PASSED (CI `1c98f14`)
- Integration: 6 SKIPPED
- Smoke this SHA: SKIPPED (not Production)

## F. SKIPPED / BLOCKED

- TC-C012–C019 + C021 DB: SKIPPED runner, **BLOCKED** Gate 3
- C008 matching rule: **BLOCKED** oracle
- Production smoke this SHA: SKIPPED ≠ PASSED
- Local Playwright: NOT EXECUTED

## G. Remaining human decisions

- Provide non-prod `SUPABASE_SERVICE_ROLE_KEY` (and URL) to execute RLS
- Search match BD if C008 must be precise
- Gate 3 human QA on `test`
- CRM GitHub Issue still missing

## H. Remaining risks

UI hide ≠ RLS until C012 runs. Agent must not invent match rules or
apply production SQL.

## I. Files changed / not changed

Changed: `docs/features/CRM-001/test-cases.md`,
`docs/features/CRM-001/ui-ux-proposal.md` (freeze list), this report,
`docs/test-reports/README.md`.
Not changed: `src/**`, Playwright specs, migrations, roles, product
rules.

## J. Final verdict

**CLEAN WITH GAPS**

ISTQB design and UI/e2e/unit evidence are in place. Gaps: High RLS
not executed; C008 oracle; C011 grouped. **Not CLEAN.** **Not BLOCKED**
on missing automated tests — they exist and skip without secrets.

Gate 3 / DoD High remains **not met** until RLS **PASSES** (skip ≠
pass). AUTH-001 stays **RELEASED**. CRM-001 stays **not RELEASED**.

**STOP.**
