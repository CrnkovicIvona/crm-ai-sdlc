# QA close-out (Phase 6): AUTH-001 + CRM-001 on `cursor/crm-001-implementation-73b9`

- Date: 2026-08-23
- RLS/e2e CI evidence SHA: `456c9a2f86e420f0b49555fd7b727773ea7c05f6` —
  [actions/32673921138](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/32673921138)
  (Vitest **19 passed, 0 skipped**; Playwright **11 passed, 0 skipped**).
  Vitest env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`,
  `E2E_VIEWER_EMAIL`, `E2E_VIEWER_PASSWORD`.
- Prior e2e-only SHA: `1c98f14` —
  [actions/32672184863](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/32672184863)
- PR: [#26](https://github.com/CrnkovicIvona/crm-ai-sdlc/pull/26) → `test`
- Lifecycle: **AUTH-001 remains `RELEASED`**. **CRM-001 is `ON_MAIN` —
  not `RELEASED`** (REL-004; human QA on `test` 2026-08-24; production
  smoke not executed).

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

| Pack       | Written | Automated | Notes                                       |
| ---------- | ------- | --------- | ------------------------------------------- |
| AUTH unit  | yes     | yes       | mapper, fail-closed, parseRole              |
| AUTH e2e   | yes     | yes       | login, logout, unauth, roles chrome         |
| AUTH smoke | yes     | yes       | REL-003; fail-closed without secrets        |
| CRM unit   | yes     | yes       | validation `TC-C002-*`, products            |
| CRM e2e    | yes     | yes       | list, CRUD, validation, VIEWER grouped      |
| CRM RLS    | yes     | yes       | 6 tests **PASSED** CI `456c9a2` (0 skipped) |

Meaningful when executed: unit always; e2e when CI secrets + catalog;
RLS only when live. UI tests ≠ database authorization.

---

## D. Spec → test coverage

AUTH FR/AC: e2e or unit for login, logout, generic error, roles,
fail-closed (unit only for AC-012). Live AC-012 session still **not**
a Playwright case (dropped TC-010).

CRM TC-C001–C011, C020–C022: automated e2e/unit **PASSED** CI.
TC-C012–C019: automated integration **PASSED** CI `456c9a2`. C008
exact search match: **BLOCKED** oracle. C011 grouped, not
field-by-field.

---

## E. Test → code validation

- Unit hits `src/lib/*`. Can fail if mapper/validator breaks.
- Playwright on `1c98f14` uses frozen kebab `data-testid`s matching
  src (`login-form`, `crm-shell`, `logout`, `product-bank_account`, …).
  CRUD no longer skips an empty catalog (FAIL instead).
- `roles.spec.ts` / VIEWER e2e: **UI**. FR-C006 RLS **PASSED** CI
  `456c9a2`.
- Vitest can no longer go green while skipping C012–C019: those six
  tests executed on `456c9a2`.

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
| Login/logout/guards        | PASSED e2e CI `456c9a2`                          |
| Fail-closed no role        | PASSED unit; not live e2e                        |
| profiles RLS               | no dedicated automated pack                      |
| Generic auth error         | PASSED unit + e2e                                |
| ADMIN/VIEWER UI            | PASSED e2e CI                                    |
| Clients RLS + audit        | **PASSED** CI `456c9a2` (6 tests)                |
| Soft-delete + unique email | PASSED e2e CI (CRUD)                             |
| `RequireAdmin`             | PARTIAL (VIEWER blocked from `/app/clients/new`) |

---

## H. Security coverage

Unauthenticated CRM, logout, generic errors: PASSED e2e CI. VIEWER
write UI: PASSED e2e. VIEWER write **API**: **PASSED** CI RLS
`456c9a2`. Service role in bundle: REL-003 step 5 historical on
production, **not** re-run on this SHA (smoke job SKIPPED).

---

## I. Test execution evidence

| Suite                         | Result     | Evidence                                |
| ----------------------------- | ---------- | --------------------------------------- |
| Prettier / ESLint / Vitest 19 | PASSED     | CI `456c9a2`                            |
| Playwright 11                 | PASSED     | CI `456c9a2` (0 skipped)                |
| RLS 6                         | **PASSED** | CI Vitest `456c9a2` (0 skipped)         |
| Production smoke this SHA     | SKIPPED    | deployment_status job                   |
| AUTH REL-003 5/5              | PASSED     | production 2026-08-23; **not** this SHA |

Detail: [CRM-001.md](CRM-001.md), AUTH-001 addendum.

---

## J. Test quality

Strengths: fail-closed unit; generic mapper; CRM validation BVA named
as `TC-C002-*`; skip ≠ pass; smoke fail-closed without secrets; ISTQB
P/N/E required in `plan-tests` without inventing oracles.

Weak: C011 grouped; C008 match BLOCKED; no profiles RLS e2e;
exploratory charter not logged.

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
TBD. Audit HOW implemented in SQL; live proof **PASSED** CI `456c9a2`.

---

## L. Traceability matrix

[matrix.md](../traceability/matrix.md) +
[CRM-001/traceability.md](../features/CRM-001/traceability.md)

AUTH rows: paths valid; execution on this branch e2e **PASSED** in CI
(addendum). CRM rows: REQ/FR/TC valid; verification **PASSED** e2e CI
where cited; C012–C019 **PASSED** CI `456c9a2`. TDE-008 “Playwright TC-001–009”
is architecture, not “coverage complete” without evidence — evidence
now exists for those AUTH e2e on `1c98f14`.

---

## M. SDLC quality gate result

Do **not** change lifecycle.

| Item                   | Result                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH-001 product       | **`RELEASED`** (unchanged). Live e2e on **this branch** now **PASSED** in CI. Production smoke **this SHA** SKIPPED; historical 5/5 still the release record. |
| CRM-001 product        | Implemented on branch; **not** `RELEASED`.                                                                                                                    |
| CRM automated DoD High | **Met** on CI `456c9a2` (unit + RLS + e2e executed).                                                                                                          |
| Human QA on `test`     | **Not claimed.**                                                                                                                                              |
| Agentic SPEC→TEST→CODE | **Closed for UI e2e + unit + RLS** on `456c9a2`. Residual: C008 match oracle, C011 grouped, profiles RLS pack, live AC-012 e2e.                               |

**QA TRACEABILITY: CLEAN WITH GAPS** (automated High RLS **PASSED**;
C008 oracle + human QA on `test` remain). Not CLEAN. Not RELEASED.

Playwright is no longer the broken DOM contract from the original
audit. High integration is **executed**. Residual gaps are oracle,
grouped VIEWER fields, and human merge/QA.

---

## P. Final verdict (same nine questions)

1. All specs represented by tests? **Designed yes. Executed yes** for
   C012–C019 on CI `456c9a2`. Remaining: live AC-012, C008 match oracle.
2. SDLC-required tests written? **Yes** for this repo’s process
   (designed at SPECIFIED, automated at implementation).
3. Tests meaningful? **Unit yes. Playwright yes on CI. RLS yes on CI.**
4. Tests validate real implementation? **Unit + e2e + RLS CI yes** on
   `456c9a2`.
5. Implementation matches specs? **AUTH yes. CRM largely yes on
   branch.**
6. Undocumented behavior? Local `signOut` **documented** (P2).
7. Important untested paths? **Yes — profiles RLS pack, AC-012 live
   e2e, C008 match oracle.**
8. Matrix accurate? **Updated for `456c9a2`**; RLS **PASSED** not
   BLOCKED.
9. QA enough to close CRM / agentic automated DoD High? **Yes on CI.**
   Human QA on `test` and RELEASED? **No.**

**QA TRACEABILITY: CLEAN WITH GAPS**

Human still needed: Preview QA; merge PR #26 to `test`; C008 oracle
if search must be exact; never merge `main` by agent. CRM-001 is **not**
`RELEASED`. AUTH-001 stays **RELEASED**.
