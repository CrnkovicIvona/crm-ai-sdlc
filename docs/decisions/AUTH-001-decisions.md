# AUTH-001 decision log

- Work item: AUTH-001
- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Spec PR: [#6](https://github.com/CrnkovicIvona/crm-ai-sdlc/pull/6)
- Date: 2026-08-21
- Author: Agent (proposals only)
- Related ADR: [ADR-0001](../adr/0001-engineering-foundation.md) (Accepted — platform intent)
- Status of this log: **PROPOSED — HUMAN APPROVAL REQUIRED**

This file is a **decision log**, not an Architecture Decision Record.
ADR-0001 remains the only accepted platform ADR. Nothing here is
approved because it is written down.

Do **not**:

- treat BD-\* or TD-\* as accepted
- update the functional or technical specification as if these values
  were approved
- create `src/`, a `feature/` branch, migrations, RLS policies, or APIs
- record Definition of Ready from this log alone

After a **human** accepts, rejects, or changes each item, update this
log’s Status fields, then update the artifacts listed under each
decision. Durable platform choices (especially TD-001) still need an
ADR via `author-adr` if accepted.

---

## Business/Product Decisions

### BD-001 Authentication

| Field                               | Value                                                                                                                                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | BD-001                                                                                                                                                                                          |
| Decision                            | How a bank employee proves identity for AUTH-001                                                                                                                                                |
| Proposed value                      | Supabase Auth with **email + password**. SSO and MFA remain out of scope for AUTH-001.                                                                                                          |
| Rationale                           | REQ-001 requires login and does not specify a method. Email + password is a supported Supabase Auth mode and is small enough for a first increment. SSO/MFA were already out of REQ-001 scope.  |
| Scope impact                        | In: login with email and password. Out: SSO, MFA, magic link, OAuth, password reset (unless a human adds them).                                                                                 |
| Affected artifacts (after approval) | FS Authentication/Login/Error; TS sign-in interface and TDE-002; REQ-001 open question 1; test cases (credential preconditions); BDD Given steps may name email/password without inventing copy |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                                                                          |

### BD-002 Provisioning

| Field                               | Value                                                                                                                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | BD-002                                                                                                                                                                     |
| Decision                            | Whether AUTH-001 includes creating employees and assigning roles in the product                                                                                            |
| Proposed value                      | Employee provisioning is **outside AUTH-001**. Do not introduce an in-app account provisioning feature unless explicitly approved.                                         |
| Rationale                           | REQ-001 did not ask for user administration. Login, logout, and role enforcement can be specified without a provisioning UI.                                               |
| Scope impact                        | AUTH-001 assumes identities and roles already exist by some out-of-band means. How QA/production users are created remains an operational question, not an in-app feature. |
| Affected artifacts (after approval) | FS Actors/Preconditions/BR-008/Open Q2; REQ-001 out of scope (already listed); TS must not add admin provisioning APIs or UI                                               |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                                                     |

### BD-003 Role model

| Field                               | Value                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Decision ID                         | BD-003                                                                                                       |
| Decision                            | How many application roles one employee may hold                                                             |
| Proposed value                      | Exactly **one** role per employee: **ADMIN** or **VIEWER**.                                                  |
| Rationale                           | REQ-001 names two roles and does not describe combination. A single role keeps authorization rules testable. |
| Scope impact                        | No dual-role users. Role change process is still provisioning (BD-002), out of AUTH-001 UI scope.            |
| Affected artifacts (after approval) | FS BR-006 and Open Q3; TS `profiles.role` constraint and TDE-005; US-003 notes                               |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                       |

### BD-004 Failed login

| Field                               | Value                                                                                                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | BD-004                                                                                                                                                                          |
| Decision                            | What the product does when authentication fails                                                                                                                                 |
| Proposed value                      | Show a **generic authentication failure** message. **No account enumeration**. **Lockout** is out of scope for AUTH-001.                                                        |
| Rationale                           | REQ-001 did not specify failure UX. A generic message avoids inventing lockout policy and avoids confirming whether an email is registered. Exact wording is not proposed here. |
| Scope impact                        | In: one unsuccessful-login outcome. Out: lockout, retry limits, “email not found” vs “wrong password”, MFA challenges.                                                          |
| Affected artifacts (after approval) | FS Error Behavior and Open Q4; TS sign-in errors and Error disclosure; new or extended test case for failed login (none exists today because it was out of REQ-001)             |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                                                          |

### BD-005 Session

| Field                               | Value                                                                                                                                                                |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | BD-005                                                                                                                                                               |
| Decision                            | When authenticated CRM access ends                                                                                                                                   |
| Proposed value                      | **Explicit logout** ends CRM access. **Session timeout** remains deferred unless explicitly approved.                                                                |
| Rationale                           | FR-007/FR-008 and AC-007 already cover logout. REQ-001 did not specify timeout. Deferring timeout avoids inventing duration.                                         |
| Scope impact                        | In: logout then deny CRM until login. Out: idle timeout, absolute timeout, remember-me, concurrent-session rules, back-button policy beyond “must be authenticated.” |
| Affected artifacts (after approval) | FS Session Behavior and Open Q5–Q6 (timeout/back-button stay deferred unless the human also decides them); TS session handling                                       |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                                               |

### BD-006 Authorization model

| Field                               | Value                                                                                                                                                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Decision ID                         | BD-006                                                                                                                                                                                                                                                       |
| Decision                            | Meaning of ADMIN “full access” and VIEWER “read-only”                                                                                                                                                                                                        |
| Proposed value                      | **ADMIN** = READ + CREATE + UPDATE + DELETE. **VIEWER** = READ only. These permissions are the authorization model for **CRM resources**. AUTH-001 **does not** introduce CRM resource-management modules.                                                   |
| Rationale                           | REQ-001 states full vs read-only without naming modules. CRUD vs READ is a permission model, not a customer/account feature. AUTH-001 still has nothing to create/update/delete except future resources.                                                     |
| Scope impact                        | Does not add customers, accounts, or other modules. Future features must apply this model unless a human changes it. AUTH-001 can still only demonstrate role distinction where a resource exists; with no modules, observable CRUD vs READ remains limited. |
| Affected artifacts (after approval) | FS Authorization/BR-002/BR-003/BR-007/Open Q7; US-003 AC notes; BDD Then steps remain abstract until a resource exists; TS TDE-006/TDE-007                                                                                                                   |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                                                                                                                                       |

### BD-007 Unauthenticated access

| Field                               | Value                                                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | BD-007                                                                                                                           |
| Decision                            | What an unauthenticated person may see                                                                                           |
| Proposed value                      | Unauthenticated users may access **only the login surface**. **CRM routes require authentication**.                              |
| Rationale                           | Matches “only authenticated users may access the CRM” and answers REQ-001 open question 8 without adding public marketing pages. |
| Scope impact                        | Public: login only. Protected: CRM. No other public routes unless a human adds them.                                             |
| Affected artifacts (after approval) | FS Access Restrictions/Open Q8; TS logical routes; future React Router public vs protected route list                            |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                           |

---

## Technical Decisions

### TD-001 Frontend architecture

| Field                               | Value                                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | TD-001                                                                                                                                                                                            |
| Decision                            | React hosting/tooling for the AUTH-001 application bootstrap                                                                                                                                      |
| Proposed value                      | **Vite + React + TypeScript**, if a human accepts this as the deferred ADR-0001 framework choice.                                                                                                 |
| Rationale                           | ADR-0001 already accepts React and TypeScript and **defers** Vite SPA vs Next.js. This proposal picks the deferred option (Vite SPA) rather than Next.js.                                         |
| Scope impact                        | Would close the framework ADR gap for AUTH-001. Would require a **new ADR** (not this log) if accepted. SPA session vs Next.js server session (TS open Q6) would follow Vite.                     |
| Affected artifacts (after approval) | ADR (new, via `author-adr`); TS Frontend/Architecture; `docs/architecture/`; later `package.json` / `src/` only in `PLANNED`                                                                      |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                                                                            |
| Architecture note                   | **Not a conflict with accepted ADR-0001 React/TS.** **Does conflict with leaving the framework deferred** until a human/ADR accepts Vite. See [Conflicts](#conflicts-with-existing-architecture). |

### TD-002 Routing

| Field                               | Value                                                                                                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | TD-002                                                                                                                                   |
| Decision                            | How public vs protected screens are routed                                                                                               |
| Proposed value                      | **React Router**, with public `/login` and protected CRM routes.                                                                         |
| Rationale                           | BD-007 needs a login surface vs CRM. React Router is a common SPA router if TD-001 (Vite) is accepted. ADR-0001 did not choose a router. |
| Scope impact                        | Adds React Router as a library (not in ADR-0001). Path `/login` is proposed; CRM path names remain to be planned after Ready.            |
| Affected artifacts (after approval) | TS pages/routes and protected routes; implementation plan file list; package dependencies only after `PLANNED`                           |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                   |
| Architecture note                   | Compatible with a Vite SPA. **Would conflict with Next.js App Router** if TD-001 is rejected in favor of Next.js.                        |

### TD-003 Authentication

| Field                               | Value                                                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | TD-003                                                                                                                                    |
| Decision                            | Auth service and client for sign-in / session / sign-out                                                                                  |
| Proposed value                      | **Supabase Auth** using the **existing intended Supabase client** (public URL + anon key). No custom login REST API.                      |
| Rationale                           | ADR-0001 and `docs/architecture/environments.md` already intend Supabase for auth later. BD-001 would use email+password on that service. |
| Scope impact                        | Requires a configured non-prod Supabase project before implementation can run. Service role key stays server-only / never in the client.  |
| Affected artifacts (after approval) | TS Supabase/Auth interfaces; environments (still no secrets in git); `.env.example` names only at bootstrap in `PLANNED`                  |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                    |
| Architecture note                   | **Compatible** with ADR-0001 (“Supabase for PostgreSQL and auth later”). Does not configure the project in this phase.                    |

### TD-004 Role storage

| Field                               | Value                                                                                                                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | TD-004                                                                                                                                                                                                   |
| Decision                            | Where ADMIN vs VIEWER is stored                                                                                                                                                                          |
| Proposed value                      | Dedicated **`profiles`** table linked to **`auth.users.id`**, with exactly one role: ADMIN or VIEWER (aligns with BD-003).                                                                               |
| Rationale                           | Keeps application role out of ad-hoc client-editable `user_metadata`. Logical schema was already sketched as an option in the technical spec; this proposal would **select** that option after approval. |
| Scope impact                        | After approval: logical schema becomes the intended design. Tables and migrations still wait for `PLANNED`. Provisioning of rows remains out of band (BD-002).                                           |
| Affected artifacts (after approval) | TS Database/`profiles` status; TDE-005; later migration only after plan approval                                                                                                                         |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                                                                                   |
| Architecture note                   | **No existing schema to conflict with.** ADR-0001 forbade schema in ENG-001; it did not forbid a later AUTH-001 schema.                                                                                  |

### TD-005 Authorization enforcement

| Field                               | Value                                                                                                                                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | TD-005                                                                                                                                                                                              |
| Decision                            | Where ADMIN/VIEWER permissions are enforced                                                                                                                                                         |
| Proposed value                      | **Both** frontend authorization/route guards **and** PostgreSQL **RLS**. Frontend checks are for UX; **RLS is the data-security boundary**.                                                         |
| Rationale                           | UI hiding is not access control. PostgreSQL/Supabase is the intended data store. BD-006 CRUD vs READ would be enforced on future CRM tables; AUTH-001 may only have `profiles` (and Auth) at first. |
| Scope impact                        | RLS policies are **not** created in this phase. `profiles` policies (who can SELECT/UPDATE role) still need a later design if TD-004 is accepted. No CRM resource tables in AUTH-001 (BD-006).      |
| Affected artifacts (after approval) | TS Authorization flow, RLS, Security; TDE-001/TDE-006/TDE-007; security review before future `READY_FOR_PR`                                                                                         |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                                                                              |
| Architecture note                   | **Compatible** with PostgreSQL/Supabase intent. Does not silently implement policies.                                                                                                               |

### TD-006 API / data access

| Field                               | Value                                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | TD-006                                                                                                                                |
| Decision                            | How the app reads/writes data and auth                                                                                                |
| Proposed value                      | **Supabase client / Auth APIs** and database access rather than custom REST endpoints, unless a later requirement needs an API layer. |
| Rationale                           | Matches current architecture intent. Avoids inventing `POST /login`.                                                                  |
| Scope impact                        | No BankCRM REST surface in AUTH-001. Edge Functions remain unused unless a human requires them.                                       |
| Affected artifacts (after approval) | TS API/RPC/Data Access (intent becomes selected, still not implemented); implementation plan                                          |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                                |
| Architecture note                   | **Compatible** with ADR-0001 / environments. **Would be revisited** if a human later requires a custom API.                           |

### TD-007 Session model

| Field                               | Value                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID                         | TD-007                                                                                                                             |
| Decision                            | Who manages the authenticated session                                                                                              |
| Proposed value                      | **Supabase-managed authenticated session** (client session for a Vite SPA if TD-001 is accepted).                                  |
| Rationale                           | Follows TD-003. BD-005 logout would call Supabase sign-out. Timeout stays deferred (BD-005).                                       |
| Scope impact                        | No custom session store. No remember-me. Framework-hosted server sessions would only apply if Next.js were chosen instead of Vite. |
| Affected artifacts (after approval) | TS Authentication flow and session questions; TDE-003/TDE-004                                                                      |
| Status                              | **PROPOSED — HUMAN APPROVAL REQUIRED**                                                                                             |
| Architecture note                   | **Compatible** with Supabase Auth. Depends on TD-001 (SPA vs Next.js).                                                             |

---

## Conflicts with existing architecture

| Proposal                                    | vs ADR-0001 / architecture docs                                           | Verdict                                                                                                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TD-001 Vite                                 | ADR-0001 **accepted** React + TypeScript and **deferred** Vite vs Next.js | Not a stack contradiction. **Unresolved deferred ADR.** Accepting Vite requires a **new ADR**. Rejecting Vite (choosing Next.js) would invalidate TD-002 React Router as stated. |
| TD-002 React Router                         | Not mentioned in ADR-0001                                                 | **New library.** Allowed only if a human accepts it. Conflicts with Next.js App Router if that framework is chosen.                                                              |
| BD-001 email + password                     | ADR does not specify identity proof                                       | No ADR conflict. Business scope decision.                                                                                                                                        |
| TD-003, TD-006, TD-007 Supabase client/Auth | ADR-0001 + environments.md: Supabase auth **later**                       | **Compatible** as intent. Project is still **not configured**.                                                                                                                   |
| TD-004 `profiles`                           | No application tables exist; ENG-001 forbade schema **in that phase**     | **Compatible** as AUTH-001 design after approval. Do not migrate now.                                                                                                            |
| TD-005 RLS                                  | PostgreSQL via Supabase                                                   | **Compatible.** Policies not created now.                                                                                                                                        |
| Redux/Zustand or custom REST                | Not proposed                                                              | Do not add.                                                                                                                                                                      |

No proposal replaces ADR-0001. No proposal is implemented.

---

## Artifacts to update after human approval

Do not update these **as approved** until the human records acceptance
(Issue #5 comment or equivalent).

1. This log — set each accepted item to Accepted (and rejected items to Rejected).
2. `docs/specifications/functional/AUTH-001.md` — replace matching `TBD — HUMAN DECISION REQUIRED` with the accepted BD values only.
3. `docs/specifications/technical/AUTH-001.md` — select proposed options; keep unaccepted TBDs.
4. `docs/requirements/REQ-001.md` — close or rewrite open questions that the human decided.
5. `docs/user-stories/AUTH-001.md` — AC-004/AC-005 notes for BD-006; role cardinality for BD-003.
6. `docs/bdd/AUTH-001.md` / `docs/test-cases/AUTH-001.md` / `docs/test-plans/AUTH-001.md` — failed login (BD-004) if in scope; login method preconditions (BD-001); unauthenticated = login only (BD-007).
7. `docs/traceability/matrix.md` — new TCs if added; still no implementation paths.
8. `docs/adr/` — **new ADR** if TD-001 (and likely TD-002) are accepted as platform truth.
9. `docs/architecture/` — only after the ADR exists; still no `src/`.

Definition of Ready is a **separate** human gate after specifications
reflect accepted decisions. This log is not Ready.

---

## Remaining unresolved (even if every proposal were accepted)

These are **not** answered by BD-001–BD-007 or TD-001–TD-007:

- Exact login and failure **copy** (BD-004 is generic, not the string).
- How employees receive credentials while provisioning is out of app scope (BD-002).
- Session timeout duration (explicitly deferred, BD-005).
- Back-button/cache behavior after logout (REQ-001 Q6 still open).
- Observable ADMIN vs VIEWER behavior **inside AUTH-001** with no CRM resource modules (BD-006 states a model, not screens).
- `profiles` RLS policy details (SELECT/INSERT/UPDATE/DELETE per actor).
- Authenticated user with **no** profile/role row.
- Exact environment variable names; which non-prod Supabase project.
- Integration-test strategy (doubles vs shared non-prod Supabase).
- CRM URL path names beyond `/login`.
- Password complexity, reset, and email verification.

Until a human accepts or replaces the proposals above, **all BD/TD
items remain open**, and AUTH-001 stays **not Ready**.
