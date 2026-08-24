# CRM-001 Gate 1 — Requirements / DoR review pack

- Work item: CRM-001
- Date: 2026-08-23
- Lifecycle: **`READY`** as of PO chat 2026-08-23 (accepted §5.1 and
  §5.2). Not `PLANNED`. Not implemented.
- Approver: human PO/BA recorded Ready in chat (no GitHub Issue).
- Agent role after Ready: write [implementation-plan.md](implementation-plan.md)
  and **stop**. Do not implement until the plan is approved.

This file is the Gate 1 review package. It does **not** add product
rules. Recommended defaults in §5 are **options for you to accept or
replace**. They are not in force until you say so on the GitHub Issue
(or an explicit chat instruction for this gate).

## 1. Verdict (agent)

Gate 1 **closed**. PO accepted §5.1 and §5.2. CRM-001 is **`READY`**.
Implementation plan is a separate Gate 2 draft.

| Question                                         | Answer                                                                                          |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Spec pack complete for High risk?                | **Yes** — REQ, FS, stories/AC, BDD, test cases, test plan, traceability, TS, decision log exist |
| GitHub Issue?                                    | **No** — none yet. Draft: [issue-draft.md](issue-draft.md)                                      |
| Blocking TBDs answered?                          | **No** — BD-T001–T006, BD-T010, TD-C006 still open (repo DoR rule)                              |
| Ready?                                           | **No.** Only you can record Ready                                                               |
| Enough to know _what_ to build without invention | **Not yet**, until blocking TBDs are decided or you accept §5 defaults                          |

AUTH-001 is **`RELEASED`**. That dependency is met.

## 2. What is already decided (do not reopen)

| ID                    | Decision                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| BD-C001               | Entity = **Client** only                                                                           |
| BD-C002               | Fields = first name, last name, email, phone, OIB, created_at **only**                             |
| BD-C003               | ADMIN: READ, CREATE, UPDATE, DELETE                                                                |
| BD-C004               | VIEWER: READ, SEARCH; no CUD                                                                       |
| BD-C005               | VIEWER sees **all** Client fields                                                                  |
| BD-C006               | **RLS** is the data boundary; UI hide is not enough                                                |
| BD-C007               | Audit **successful** CREATE, UPDATE, DELETE                                                        |
| BD-C008               | Audit minimum: actor ID, action, entity, entity ID, timestamp                                      |
| BD-C009               | UPDATE audit includes previous value and new value                                                 |
| BD-C010               | Audit is **append-only** in the app (ADMIN cannot edit/delete audit via CRM)                       |
| BD-C011               | READ is **not** audited                                                                            |
| BD-C012               | Failed / unauthorized attempts are **not** audited                                                 |
| BD-C013               | No extra CRM entities                                                                              |
| BD-C014               | No field-level security                                                                            |
| BD-C015               | No audit admin/query/export feature in CRM-001                                                     |
| TD-C001–C004, TD-C007 | Reuse AUTH-001 / ADR-0001 / ADR-0002 (Vite, React, TS, React Router, Supabase, Vitest, Playwright) |

Full text: [decisions.md](decisions.md).

## 3. Out of scope (CRM-001)

- Other entities (deals, tasks, dashboard — DASH-001)
- Extra Client fields
- AUTH-001 rework
- Custom REST/GraphQL
- Audit UI
- Production SQL applied by the agent
- Implementation before Gates 1 and 2

## 4. How we will accept the result (already specified)

Designed, **not executed**. Coverage: [traceability.md](traceability.md).

| AC           | Acceptance (plain language)                                          |
| ------------ | -------------------------------------------------------------------- |
| AC-C001      | Only Client exists as a CRM entity                                   |
| AC-C002      | Only the six approved fields                                         |
| AC-C003–C006 | ADMIN can read, create, update, delete Clients                       |
| AC-C007–C008 | VIEWER can read and search                                           |
| AC-C009–C010 | VIEWER cannot create, update, or delete                              |
| AC-C011      | VIEWER sees all Client fields                                        |
| AC-C012      | CUD authorization holds at the database, not only in the UI          |
| AC-C013–C016 | Successful CUD audited with required attributes (UPDATE has old+new) |
| AC-C017      | Nobody changes audit records through the CRM app                     |
| AC-C018–C019 | READ and failed attempts are not audited                             |

Tests TC-C001–TC-C019 are **DESIGNED**, **NOT EXECUTED**.

These ACs are not enough to plan validation, uniqueness, search
matching, DELETE confirm, or audit write mechanism. That is §5–§6.

## 5. Recommended defaults (ACCEPTED Gate 1, 2026-08-23)

Use this table only if you **explicitly accept** it. If you prefer
other rules, write them instead. Do not leave blocking rows blank if
you want Ready.

### 5.1 Blocking for Ready (repo DoR)

| ID      | Topic            | Recommended default (proposal only)                                                                                                                                                             | Why this default                                     |
| ------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| BD-T001 | Email validation | Required. Must look like an email (`local@domain` with a dot in the domain). No MX check.                                                                                                       | Enough to reject empty/garbage without a mail vendor |
| BD-T002 | Phone validation | Required. Digits, optional leading `+`, optional spaces. After stripping spaces: 8–15 digits. No country picker.                                                                                | International-ish without inventing a format library |
| BD-T003 | OIB validation   | Required. Exactly **11 digits**. **No** checksum in CRM-001.                                                                                                                                    | Croatian OIB length without claiming legal checksum  |
| BD-T004 | Email unique     | **Yes** — unique among Clients (case-insensitive). Duplicate CREATE/UPDATE is rejected.                                                                                                         | Prevents two Clients sharing a mailbox               |
| BD-T005 | Phone unique     | **No**.                                                                                                                                                                                         | Shared numbers are common; email is the unique key   |
| BD-T006 | Search           | ADMIN and VIEWER. Case-insensitive **partial** match on first name, last name, email, phone, OIB. Empty query = full list (subject to pagination).                                              | Makes AC-C008 testable                               |
| BD-T010 | DELETE confirm   | ADMIN must confirm in the UI before DELETE. Cancel leaves the Client unchanged. No extra type-to-confirm.                                                                                       | High-risk PII delete                                 |
| TD-C006 | Audit write      | PostgreSQL table for audit rows + **database trigger** on Client INSERT/UPDATE/DELETE so a successful CUD cannot skip audit. App users cannot UPDATE/DELETE audit rows (RLS). No audit screens. | Matches append-only + “do not invent audit UI”       |

### 5.2 Non-blocking unless you say they block

If you do not answer these, the **implementation plan** (Gate 2) will
still need a concrete choice. Safer: accept the defaults now.

| ID      | Topic           | Recommended default (proposal only)                                                                                                                                       |
| ------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BD-T007 | Sort            | Last name, then first name, A–Z (case-insensitive)                                                                                                                        |
| BD-T008 | Pagination      | 20 Clients per page; page controls if more than 20                                                                                                                        |
| BD-T009 | Empty state     | No Clients: “No clients yet.” Search with no hits: “No matching clients.”                                                                                                 |
| BD-T011 | Error copy      | One generic line for failed save/delete/load: `Operation failed.` Field errors: name the field (email / phone / OIB / unique email). Same fail-closed spirit as AUTH-001. |
| BD-T012 | Success copy    | CREATE: `Client created.` UPDATE: `Client saved.` DELETE: `Client deleted.`                                                                                               |
| BD-T013 | Layout          | Reuse AUTH-001 signed-in shell. List + search; ADMIN create/edit form; VIEWER read-only detail. No new design system.                                                     |
| BD-T014 | Routes          | `/app/clients`, `/app/clients/new`, `/app/clients/:id` (protected like `/app`)                                                                                            |
| BD-T015 | Audit retention | Keep all audit rows in CRM-001. No purge job.                                                                                                                             |
| BD-T016 | Audit query UI  | **None** (already BD-C015).                                                                                                                                               |
| BD-T017 | Failed DB ops   | Show generic error. Do not show a success state. Partial UI update is not success.                                                                                        |
| BD-T018 | Transactions    | Client write and audit row must succeed together or fail together (trigger in TD-C006).                                                                                   |
| TD-C005 | Physical names  | Defer table/column names to the implementation plan after Ready. Logical fields stay as BD-C002.                                                                          |

## 6. Definition of Ready checklist (scored)

From [../../sdlc/definition-of-ready.md](../../sdlc/definition-of-ready.md).

| Item                                                                              | Status                                                            |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| GitHub Issue is the source request                                                | **FAIL** — you must open it from [issue-draft.md](issue-draft.md) |
| Business objective, scope, out of scope explicit                                  | PASS                                                              |
| REQ exists                                                                        | PASS                                                              |
| Functional specification (WHAT)                                                   | PASS                                                              |
| User stories and AC                                                               | PASS                                                              |
| BDD (High)                                                                        | PASS (designed)                                                   |
| Test cases and risk-based test plan                                               | PASS (designed, not executed)                                     |
| Traceability REQ → FR → US → AC → BDD → TC → TDE                                  | PASS; implementation empty                                        |
| Technical specification (HOW on existing ADRs)                                    | PASS; audit HOW still TBD                                         |
| High: decision log; security notes; BD/TD approved **or** explicitly non-blocking | **FAIL** until §5 blocking rows are decided                       |
| Open questions listed; none silently answered                                     | PASS (this pack)                                                  |
| Dependencies and environments identified                                          | PASS — AUTH-001 `RELEASED`; non-prod Supabase later in the plan   |
| No secrets in ticket or docs                                                      | PASS                                                              |
| Human Ready recorded on the Issue                                                 | **FAIL** — your gate                                              |

**DoR is not met.** That is expected at Gate 1 until you act.

## 7. Security notes (for DoR, not SQL)

- PII: email, phone, OIB.
- DELETE is ADMIN-only and irreversible in CRM-001 (no recycle bin unless you add one — out of scope).
- VIEWER must be denied CUD in **UI and RLS**.
- Fail-closed AUTH-001 sessions must not reach Client data.
- Service role must not ship in the browser.
- Audit must not be editable in the app.

No RLS policy SQL in this pack.

## 8. What I will not do until you pass Gate 1

- Record `READY`
- Write `implementation-plan.md`
- Create `feature/` or `src/`
- Invent validation/search/audit HOW as product truth
- Merge to `main`
- Start DASH-001

## 9. What you must do next (PO/BA)

**This is your gate. I cannot complete it.**

1. **Open a GitHub Feature Issue** using [issue-draft.md](issue-draft.md). Paste the title and body. Then comment the Issue number in chat (I cannot create Issues with the current GitHub token).
2. **Decide blocking TBDs** using **one** of:
   - **A — Accept all recommended defaults** in §5.1 and §5.2 (fastest path to Ready).
   - **B — Accept §5.1 only** and answer or defer §5.2 row by row.
   - **C — Replace any row** with your own rule (one line per ID).
   - **D — Stay SPECIFIED** (no Ready).
3. If A, B, or C is complete, **record Ready** on the Issue with an explicit sentence, for example:  
   `CRM-001 is READY. I accept the Gate 1 pack and the defaults I named.`
4. Do **not** ask me to implement yet. After Ready I write Gate 2
   `implementation-plan.md` and **stop again** for your plan approval.

Copy-paste comments are in [issue-draft.md](issue-draft.md).
