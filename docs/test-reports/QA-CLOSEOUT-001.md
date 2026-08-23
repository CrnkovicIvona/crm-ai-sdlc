# QA close-out (Phase 6): AUTH-001 + CRM-001 on `cursor/crm-001-implementation-73b9`

- Date: 2026-08-23
- Branch HEAD at report authoring: `440d69c` (Phase 5 evidence commit)
- E2E/unit CI evidence SHA: `1c98f14` —
  [actions/32672184863](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/32672184863)
- PR: [#26](https://github.com/CrnkovicIvona/crm-ai-sdlc/pull/26) → `test`
- Lifecycle: **AUTH-001 remains `RELEASED`**. **CRM-001 remains not
  `RELEASED`**. This report does **not** change states.

Remediation on this branch (controlled): P0 selectors/docs freeze →
P1 historical AUTH/strategy notes → CI logout wait + Prettier → P2
smoke/e2e helpers + local `signOut` → ISTQB P/N/E process → Phase 5
execution record. No new product scope, roles, or production SQL.

Words: **PASSED** only with execution evidence. **SKIPPED ≠ PASSED**.
**BLOCKED ≠ PASSED**. **DESIGNED ≠ EXECUTED**.

---

## A. SDLC baseline

Canonical flow: [lifecycle.md](../sdlc/lifecycle.md) —
`REQUESTED` → `SPECIFIED` → human DoR → `READY` → plan approval →
`PLANNED` → code + automated tests → `TESTING` → `READY_FOR_PR` → PR
to `test` (`IN_QA`) → human QA → `READY_FOR_RELEASE` → human `main`
(`ON_MAIN`) → production smoke PASSED → `RELEASED`.

There is **no** git status `TEST approved before src/`. Designed TCs
live in docs at `SPECIFIED`; Playwright/Vitest files are added with
implementation after `PLANNED`.

This branch: AUTH-001 **`RELEASED` on `main`** (REL-003 smoke 5/5
historical). CRM-001 **`PLANNED` / implementing**, PR to `test`, **not**
`RELEASED`. Gate 3 (human QA on `test`) is **not** claimed complete.

---

## B. Specification inventory

**AUTH-001 (legacy paths):** REQ-001, FS, TS (as-shipped notes),
US/AC, BDD, TC-001–TC-009 (no TC-010), test plan, decisions, feature
README, REL-003. Roles **ADMIN / VIEWER**.

**CRM-001:** [features/CRM-001/](../features/CRM-001/) REQ, FR-C001–C016,
US, AC-C001–C022, TC-C001–C022, TDE, UX proposal applied, ISTQB P/N/E
matrix.

---

## C. Test inventory

| Pack       | Written | Automated | Notes                                   |
| ---------- | ------- | --------- | --------------------------------------- |
| AUTH unit  | yes     | yes       | mapper, fail-closed, parseRole          |
| AUTH e2e   | yes     | yes       | login, logout, unauth, roles chrome     |
| AUTH smoke | yes     | yes       | REL-003; fail-closed without secrets    |
| CRM unit   | yes     | yes       | validation `TC-C002-*`, products        |
| CRM e2e    | yes     | yes       | list, CRUD, validation, VIEWER grouped  |
| CRM RLS    | yes     | yes       | 6 tests; skip without live service role |

Meaningful when executed: unit always; e2e when CI secrets + catalog;
RLS only when live. UI tests ≠ database authorization.

---

## D. Spec → test coverage

AUTH FR/AC: e2e or unit for login, logout, generic error, roles,
fail-closed (unit only for AC-012). Live AC-012 session still **not**
a Playwright case (dropped TC-010).

CRM TC-C001–C011, C020–C022: automated e2e/unit. TC-C012–C019:
automated integration, **not executed**. C008 exact search match:
**BLOCKED** oracle. C011 grouped, not field-by-field.

---

## E. Test → code validation

- Unit hits `src/lib/*`. Can fail if mapper/validator breaks.
- Playwright on `1c98f14` uses frozen kebab `data-testid`s matching
  src (`login-form`, `crm-shell`, `logout`, `product-bank_account`, …).
  CRUD no longer skips an empty catalog (FAIL instead).
- `roles.spec.ts` / VIEWER e2e: **UI**. FR-C006 is RLS (**BLOCKED**).
- Could still “go green” while RLS is broken: **yes**, until C012–C019
  run.

---

## F. Spec → code validation

AUTH FR-001–FR-013: implemented; `signOut({ scope: 'local' })`
documented as shipped. AUTH TS “no src” treated as **specification-time**,
not current `main`.

CRM FR-C001–C016: implemented on this branch (clients, products,
soft-delete, audit SQL, UI). Not on `main`. Human applies non-prod SQL.
UX items 1–8 applied.

---

## G. Code → test coverage

| Area                       | Status                                           |
| -------------------------- | ------------------------------------------------ |
| Login/logout/guards        | PASSED e2e CI `1c98f14`                          |
| Fail-closed no role        | PASSED unit; not live e2e                        |
| profiles RLS               | no dedicated automated pack                      |
| Generic auth error         | PASSED unit + e2e                                |
| ADMIN/VIEWER UI            | PASSED e2e CI                                    |
| Clients RLS + audit        | **BLOCKED** (6 skipped)                          |
| Soft-delete + unique email | PASSED e2e CI (CRUD)                             |
| `RequireAdmin`             | PARTIAL (VIEWER blocked from `/app/clients/new`) |

---

## H. Security coverage

Unauthenticated CRM, logout, generic errors: PASSED e2e CI. VIEWER
write UI: PASSED e2e. VIEWER write **API**: **BLOCKED**. Service role
in bundle: REL-003 step 5 historical on production, **not** re-run on
this SHA (smoke job SKIPPED). UI ≠ authorization.

---

## I. Test execution evidence

| Suite                         | Result                       | Evidence                                |
| ----------------------------- | ---------------------------- | --------------------------------------- |
| Prettier / ESLint / Vitest 13 | PASSED                       | local `1c98f14` + CI                    |
| Playwright 11                 | PASSED                       | CI `1c98f14` (0 skipped)                |
| RLS 6                         | SKIPPED → **BLOCKED** Gate 3 | CI + local `npm test`                   |
| Production smoke this SHA     | SKIPPED                      | deployment_status job                   |
| AUTH REL-003 5/5              | PASSED                       | production 2026-08-23; **not** this SHA |

Detail: [CRM-001.md](CRM-001.md), AUTH-001 addendum.

---

## J. Test quality

Strengths: fail-closed unit; generic mapper; CRM validation BVA named
as `TC-C002-*`; skip ≠ pass; smoke fail-closed without secrets; ISTQB
P/N/E required in `plan-tests` without inventing oracles.

Weak: RLS not executed; C011 grouped; C008 match BLOCKED; no profiles
RLS e2e; exploratory charter not logged.

Playwright cases were designed from SPEC TCs; selectors now match UX
freeze (P0 remediaiton).

---

## K. Specification consistency

Addressed on this branch vs original audit: AUTH TS/plan historical;
testing-strategy CRM implemented on feature branch not RELEASED;
REL-003 CRM-specs-only scoped to that release; CRM test-cases no longer
claim “no src”; matrix paths updated; AUTH error uses
`GENERIC_AUTH_ERROR`; testids kebab; ISTQB templates + BLOCKED word.

Remaining: AUTH pack still dual legacy paths (P2-01 keep). Search UX
TBD. Audit HOW was implemented in SQL; live proof **BLOCKED**.

---

## L. Traceability matrix

[matrix.md](../traceability/matrix.md) +
[CRM-001/traceability.md](../features/CRM-001/traceability.md)

AUTH rows: paths valid; execution on this branch e2e **PASSED** in CI
(addendum). CRM rows: REQ/FR/TC valid; verification **PASSED** e2e CI
where cited; C012–C019 **BLOCKED**. TDE-008 “Playwright TC-001–009”
is architecture, not “coverage complete” without evidence — evidence
now exists for those AUTH e2e on `1c98f14`.

---

## M. SDLC quality gate result

Do **not** change lifecycle.

| Item                   | Result                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH-001 product       | **`RELEASED`** (unchanged). Live e2e on **this branch** now **PASSED** in CI. Production smoke **this SHA** SKIPPED; historical 5/5 still the release record. |
| CRM-001 product        | Implemented on branch; **not** `RELEASED`.                                                                                                                    |
| CRM Gate 3 / DoD High  | **Not met** — RLS/audit **BLOCKED**.                                                                                                                          |
| Agentic SPEC→TEST→CODE | **Closed for UI e2e + unit** on `1c98f14`. **Not closed** for database authorization.                                                                         |

**QA TRACEABILITY: BLOCKED** (Gate 3 / RLS), not CLEAN.

Playwright is no longer the broken DOM contract from the original
audit. Residual block is **unexecuted High integration**, not
testid mismatch.

---

## P. Final verdict (same nine questions)

1. All specs represented by tests? **Designed yes. Executed no** for
   C012–C019, live AC-012, C008 match oracle.
2. SDLC-required tests written? **Yes** for this repo’s process
   (designed at SPECIFIED, automated at implementation).
3. Tests meaningful? **Unit yes. Playwright yes on CI. RLS not
   evidenced.**
4. Tests validate real implementation? **Unit + e2e CI yes. RLS
   unknown this SHA.**
5. Implementation matches specs? **AUTH yes. CRM largely yes on
   branch.**
6. Undocumented behavior? Local `signOut` **documented** (P2).
7. Important untested paths? **Yes — live RLS/audit, profiles RLS,
   AC-012 live.**
8. Matrix accurate? **Updated for this SHA**; RLS still BLOCKED not
   PASSED.
9. QA enough to close CRM / agentic Gate 3? **No.**

**QA TRACEABILITY: BLOCKED**

Human still needed: non-prod service role (or equivalent) so C012–C019
**execute**; search match oracle if C008 must be precise; Gate 3 QA on
`test`; never merge `main` by agent.
