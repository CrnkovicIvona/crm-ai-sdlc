# TS-AUTH-001: Bank employee login and role-based access

- Work item: AUTH-001
- Functional specification: [../functional/AUTH-001.md](../functional/AUTH-001.md)
- Requirement: [REQ-001](../../requirements/REQ-001.md)
- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Spec PR: [#6](https://github.com/CrnkovicIvona/crm-ai-sdlc/pull/6)
- Status: Draft (not Definition of Ready; several technical decisions open)
- Author: Agent (constrained by ADR-0001 and `docs/architecture/`; not human-approved)

This document is the **technical specification**: how AUTH-001 would be
implemented inside the **existing** platform intent. It does not
implement anything. It does not invent product behavior.

Business rules (for example “VIEWER users have read-only access”)
remain in the functional specification. Enforcement mechanisms (for
example RLS vs application checks) belong here and stay `TBD` until a
human approves them.

## Architecture

### Approved platform (ADR-0001, Accepted)

| Decision                         | Status                                       |
| -------------------------------- | -------------------------------------------- |
| TypeScript                       | Accepted                                     |
| React for the UI                 | Accepted                                     |
| Vite SPA vs Next.js              | **Deferred** (future ADR at app bootstrap)   |
| Supabase for PostgreSQL and auth | Accepted as **later** intent; not configured |
| Vitest                           | Accepted                                     |
| Playwright                       | Accepted                                     |
| ESLint and Prettier              | Accepted                                     |
| GitHub Actions CI                | Accepted                                     |
| Vercel Preview and Production    | Accepted as **later** intent; not configured |

No application source (`src/`) exists. No Supabase project is
configured. Architecture README records **environment intent only**.

### Application layers (intended, not built)

When the application is bootstrapped under the deferred React
framework ADR:

1. **Presentation** — React UI (login, logout, CRM shell, role-aware
   presentation).
2. **Client application logic** — session awareness, route/access
   gating in the UI, calls to the approved data-access mechanism.
3. **Backend-as-a-service** — Supabase Auth and PostgreSQL (see
   environments.md). There is **no** accepted decision to add a
   custom REST API, GraphQL server, or Edge Function layer for
   AUTH-001.
4. **Data** — PostgreSQL via Supabase. Schema is not created.

Frontend/backend boundary: the browser uses the **public** Supabase
URL and anon key. The Supabase **service role** key must never ship
in the client (environments.md).

### Relevant modules (logical; no source files)

| Logical module | Responsibility                                    |
| -------------- | ------------------------------------------------- |
| Auth session   | Sign-in, sign-out, current user                   |
| Role access    | Read ADMIN vs VIEWER for the authenticated user   |
| Access gate    | Deny CRM UI/data when unauthenticated             |
| Role-aware UI  | Present full vs read-only according to FR-004/005 |

Physical file paths: `TBD — HUMAN DECISION REQUIRED` (depends on
Vite vs Next.js and folder conventions not yet chosen).

### Request / data flow (logical)

Unauthenticated CRM access:

```
Person → CRM route/screen → access gate → deny (FR-002)
```

Login (mechanism unspecified at business level):

```
Employee → login surface → Supabase Auth (intended) → session
        → access gate allows CRM (FR-001)
```

Authorized use:

```
Authenticated user → CRM UI → data access as that user
                  → authorization by role (FR-004 / FR-005)
```

Logout:

```
Authenticated user → logout action → session ended
                  → CRM access denied until login (FR-008)
```

Exact Auth API (email/password, OAuth, SSO) cannot be chosen until
the human answers functional open question 1.

### Authentication flow

Intended service: **Supabase Auth** (ADR-0001, environments.md).

Not decided:

- Identity method: `TBD — HUMAN DECISION REQUIRED` (business Q1)
- Whether the React app uses a SPA session (local client) or a
  framework-hosted server session: `TBD — HUMAN DECISION REQUIRED`
  (depends on Vite vs Next.js)

### Authorization flow

Business rule: ADMIN full access; VIEWER read-only.

Technical enforcement options (none selected):

1. PostgreSQL Row Level Security keyed on role claims / profile row
2. Application-only checks in React
3. Combination of RLS (data) and UI (presentation)

Selection: `TBD — HUMAN DECISION REQUIRED`.

RLS is **justified by** the accepted PostgreSQL/Supabase direction
when persistent CRM data exists. AUTH-001 currently has **no**
approved CRM data tables, so RLS targets besides possible future
role/profile storage remain unknown.

## Frontend

React + TypeScript (ADR-0001). Routing library is **not** approved:
React Router vs Next.js App Router is deferred. Do not treat React
Router as decided.

### Pages / routes (logical)

| Logical route     | Audience           | Purpose                        |
| ----------------- | ------------------ | ------------------------------ |
| Login             | Unauthenticated    | Become authenticated (FR-006)  |
| CRM (application) | Authenticated only | CRM access (FR-001, FR-002)    |
| (logout)          | Authenticated      | Action, not necessarily a page |

URL paths and whether login is the only public route:
`TBD — HUMAN DECISION REQUIRED` (functional Q8).

### Components (logical; not created)

| Component                     | Responsibility                                   |
| ----------------------------- | ------------------------------------------------ |
| Login form / entry            | Collect whatever the approved login method needs |
| Logout control                | End session (FR-007)                             |
| Access gate / protected shell | Block CRM when unauthenticated (FR-002)          |
| CRM shell                     | Authenticated application frame                  |
| Role-aware region             | Full vs read-only presentation (FR-004, FR-005)  |

Component file names: not specified (no `src/`).

### Forms and validation

Login field set depends on business Q1:
`TBD — HUMAN DECISION REQUIRED`.

Client-side validation rules are not in REQ-001. Do not invent
password complexity or email format rules.

### State management

No state library is in ADR-0001. Session state is expected to come
from the Supabase Auth client (or the framework’s approved Auth
helper once chosen). Additional global stores (Redux, Zustand, etc.)
are **not** introduced unless a human approves them.

Loading and error states for login/logout:
`TBD — HUMAN DECISION REQUIRED` (functional error behavior is open).

### Protected routes

CRM routes/screens must be unreachable without authentication
(FR-002). Implementation shape:

- SPA: route guard in the chosen router
- Next.js: `TBD` server/layout guard vs client guard

Choice: `TBD — HUMAN DECISION REQUIRED` (framework ADR).

### Role-aware UI behavior

- ADMIN: UI may offer full CRM actions once those actions exist
  (FR-004).
- VIEWER: UI must not present or must disable write actions
  (FR-005).
- Concrete controls: `TBD — HUMAN DECISION REQUIRED` until other
  CRM features exist (functional Q7).
- UI is not a substitute for data authorization if CRM data is
  persisted (see Security / RLS).

## Supabase

### Usage (intent)

| Service                           | AUTH-001 relevance                                      | Configured now |
| --------------------------------- | ------------------------------------------------------- | -------------- |
| Supabase Auth                     | Authenticate employees; session; logout                 | No             |
| PostgreSQL                        | Persist role (if not only in Auth metadata); future CRM | No             |
| Storage, Realtime, Edge Functions | Not required by stated AUTH-001 scope                   | No             |

Do not assume Edge Functions or a custom REST surface.

### Authentication flow (technical)

Intended: browser (or approved SSR helper) → Supabase Auth → JWT /
session for the user.

Sign-in API variant (email+password, magic link, SSO):
`TBD — HUMAN DECISION REQUIRED`.

### Authorization model

Supabase can carry role in `app_metadata` (service-role written),
`user_metadata`, or a profile table. Which store is used:
`TBD — HUMAN DECISION REQUIRED`.

Postgres `auth.users` is owned by Supabase Auth. Application tables
must not be invented beyond a **proposed** profile if humans choose
that option (see Database).

### Client / server boundaries

- **Client (anon key):** sign-in, sign-out, read current session,
  request data allowed by RLS.
- **Server / service role:** provisioning, assigning roles, admin
  Auth APIs — only if humans place provisioning in scope (currently
  out of functional scope). Service role must not be in the client.

### Security considerations

- No secrets in the repo (existing security rules).
- Anon key is public; authorization must not rely on hiding it.
- Exact JWT claim for role: `TBD — HUMAN DECISION REQUIRED`.

## Database

Persistence is required for **users as identities** (Supabase Auth)
and for **role** if role is not stored only in Auth metadata.

No BankCRM application tables exist. None are created in this phase.

### Supabase-managed (not designed here)

`auth.users` (and related Auth schema) is provided by Supabase Auth.
Do not recreate it as an application table.

### Proposed application table (not approved)

If humans choose a profile row instead of Auth metadata only, a
logical table could be:

`profiles`

| Column     | Type                        | Required | Description                       |
| ---------- | --------------------------- | -------- | --------------------------------- |
| id         | UUID                        | yes      | Primary key; matches Auth user id |
| role       | ADMIN \| VIEWER (enum/text) | yes      | Application role (FR-003)         |
| created_at | timestamptz                 | yes      | Audit: created                    |
| updated_at | timestamptz                 | yes      | Audit: last change                |

- Primary key: `id`
- Foreign key: `id` → `auth.users.id` (logical; exact FK syntax later)
- Unique: `id` (one profile per auth user)
- Index: PK sufficient unless listing users is specified (it is not)
- Nullable: none in the columns above
- Whether `role` allows both values at once: forbidden until
  functional Q3 is answered. Do not encode “exactly one” vs “both”
  in a constraint yet.

**Status of `profiles`:** proposed option only.
`TBD — HUMAN DECISION REQUIRED` whether this table exists.

No other AUTH-001 tables are identified. Do not add customers,
accounts, or sessions tables without a requirement.

## Row Level Security

RLS is relevant **if** application tables exist in PostgreSQL.

| Table                   | RLS required             | SELECT                          | INSERT                          | UPDATE                          | DELETE                          |
| ----------------------- | ------------------------ | ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- |
| `auth.*`                | Managed by Supabase Auth | Do not author policies here     |                                 |                                 |                                 |
| `profiles` (if created) | Yes, if the table exists | `TBD — HUMAN DECISION REQUIRED` | `TBD — HUMAN DECISION REQUIRED` | `TBD — HUMAN DECISION REQUIRED` | `TBD — HUMAN DECISION REQUIRED` |

Role effect (business: ADMIN full, VIEWER read-only) on `profiles`:

- Reading one’s own role is likely required for the UI.
- Who may change `role`: `TBD — HUMAN DECISION REQUIRED`
  (provisioning is out of functional scope).
- There are **no** CRM entity tables yet, so ADMIN vs VIEWER RLS on
  CRM data cannot be specified. When those tables exist, RLS should
  be designed so VIEWER cannot write and ADMIN can, matching FR-004
  and FR-005 — that is a future technical design, not an AUTH-001
  policy to create now.

Do not create RLS policies in this phase.

## API / RPC / Data Access

ADR-0001 and environments.md point to **Supabase client access**, not
a BankCRM REST API. AUTH-001 does **not** invent HTTP endpoints.

Chosen mechanism (intent): **Supabase Auth APIs + (optional) table
access via the Supabase client**, subject to RLS.

### Interface: sign in

| Field                   | Value                                                     |
| ----------------------- | --------------------------------------------------------- |
| Method / type           | Supabase Auth sign-in (exact method TBD)                  |
| Logical name            | `auth.signIn` (logical; SDK method depends on login type) |
| Purpose                 | Authenticate a bank employee (FR-006)                     |
| Authentication required | No (this establishes authentication)                      |
| Authorization required  | N/A                                                       |
| Request parameters      | `TBD — HUMAN DECISION REQUIRED` (depends on login method) |
| Response                | Session / user on success; no session on failure          |
| Validation              | `TBD — HUMAN DECISION REQUIRED`                           |
| Errors                  | Failed login behavior `TBD — HUMAN DECISION REQUIRED`     |

### Interface: sign out

| Field                   | Value                           |
| ----------------------- | ------------------------------- |
| Method / type           | Supabase Auth sign-out          |
| Logical name            | `auth.signOut`                  |
| Purpose                 | End session (FR-007, FR-008)    |
| Authentication required | Yes (authenticated user)        |
| Authorization required  | Any authenticated role          |
| Request parameters      | None stated                     |
| Response                | No authenticated session        |
| Validation              | N/A                             |
| Errors                  | `TBD — HUMAN DECISION REQUIRED` |

### Interface: current session / user

| Field                   | Value                              |
| ----------------------- | ---------------------------------- |
| Method / type           | Supabase Auth session read         |
| Logical name            | `auth.getSession` / equivalent     |
| Purpose                 | Drive access gate (FR-001, FR-002) |
| Authentication required | Session may be present or absent   |
| Authorization required  | N/A                                |
| Request parameters      | None                               |
| Response                | Current user or unauthenticated    |
| Validation              | N/A                                |
| Errors                  | `TBD — HUMAN DECISION REQUIRED`    |

### Interface: read role

| Field                   | Value                                                                |
| ----------------------- | -------------------------------------------------------------------- |
| Method / type           | Auth claims and/or `profiles` SELECT                                 |
| Logical name            | `auth.getRole` (logical)                                             |
| Purpose                 | Distinguish ADMIN vs VIEWER (FR-003–FR-005)                          |
| Authentication required | Yes                                                                  |
| Authorization required  | Authenticated user; who may read whose role is TBD                   |
| Request parameters      | Implicit current user, unless admin listing is specified (it is not) |
| Response                | ADMIN or VIEWER (or both if Q3 allows — TBD)                         |
| Validation              | Role must be one of the two stated values once Q3 is answered        |
| Errors                  | Missing role: `TBD — HUMAN DECISION REQUIRED`                        |

No RPC names are approved. Do not add `POST /login` unless a human
approves a custom API, which would conflict with current intent.

## Security

| Control          | AUTH-001 treatment                                                                  |
| ---------------- | ----------------------------------------------------------------------------------- |
| Authentication   | Required for CRM (FR-002); via intended Supabase Auth                               |
| Authorization    | ADMIN vs VIEWER (FR-004, FR-005); enforcement TBD                                   |
| Session handling | Auth session; timeout TBD (business Q5)                                             |
| Input validation | Login inputs TBD with method                                                        |
| Access control   | UI gate + data layer TBD                                                            |
| RLS              | Required for any application tables; policies TBD                                   |
| Sensitive data   | Credentials never logged or committed; service role never in client                 |
| Error disclosure | Failed-login copy TBD; do not leak whether an account exists unless a human says so |
| Logout           | Must invalidate session for subsequent CRM access (FR-008)                          |

Security review remains required at High risk before
`READY_FOR_PR` of a future implementation (test plan).

## Testing Architecture

No tests are executed in this phase. When an app exists, layers from
`docs/sdlc/testing-strategy.md`:

| Layer             | Tool               | AUTH-001 relevance                                                        |
| ----------------- | ------------------ | ------------------------------------------------------------------------- |
| Unit              | Vitest             | Access-gate helpers, role presentation helpers once they exist            |
| Integration       | Vitest             | Auth client wrappers; role read against test doubles or non-prod Supabase |
| API / data access | Vitest             | Supabase client usage; not REST unless an API is approved                 |
| Authorization     | Vitest + e2e       | ADMIN vs VIEWER; RLS tests when policies exist                            |
| E2E               | Playwright         | TC-001–TC-006 as in the test plan                                         |
| Static analysis   | ESLint             | When `src/` exists                                                        |
| Format / secrets  | Prettier, gitleaks | Already in foundation CI                                                  |

Until `src/` exists: ESLint, Vitest, Playwright are **NOT
APPLICABLE**. Do not report them as passed.

## Dependencies

| Dependency                          | Kind          | Notes                                                                                                 |
| ----------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| ADR-0001                            | Architecture  | TypeScript, React, Supabase later, Vitest, Playwright, ESLint, Prettier, Vercel later, GitHub Actions |
| `docs/architecture/environments.md` | Architecture  | Topology and secret rules                                                                             |
| FS-AUTH-001 / REQ-001               | Functional    | Must not be contradicted                                                                              |
| US/AC/BDD/TC AUTH-001               | Specification | Test mapping                                                                                          |
| React framework ADR                 | Missing       | Blocks concrete routing and session pattern                                                           |
| Configured Supabase project         | Missing       | Blocks implementation                                                                                 |
| Configured Vercel project           | Missing       | Blocks hosted Preview/Production; local can still be planned later                                    |

No existing application modules. No `src/` imports.

## Open Technical Questions

Separate from business questions in FS-AUTH-001.

1. Which React hosting framework (Vite SPA vs Next.js) is used for
   AUTH-001 bootstrap? `TBD — HUMAN DECISION REQUIRED` (ADR-0001
   deferred this; needed for routes and session.)
2. Where is ADMIN/VIEWER stored (Auth `app_metadata`,
   `user_metadata`, `profiles` table, or other)?
   `TBD — HUMAN DECISION REQUIRED`
3. Is authorization enforced with PostgreSQL RLS, application checks,
   or both? `TBD — HUMAN DECISION REQUIRED`
4. If `profiles` exists, what are the SELECT/INSERT/UPDATE/DELETE
   policies per actor? `TBD — HUMAN DECISION REQUIRED`
5. Sign-in SDK method once business Q1 is answered (email/password,
   SSO, other)? `TBD — HUMAN DECISION REQUIRED`
6. SPA client session vs framework server session?
   `TBD — HUMAN DECISION REQUIRED`
7. Is any custom REST/RPC/Edge Function allowed for AUTH-001, or is
   Supabase client-only? Current architecture intent is client +
   Auth; changing that is `TBD — HUMAN DECISION REQUIRED`
8. Environment variable names and which keys are exposed to the
   client? Reserved in environments.md; exact names
   `TBD — HUMAN DECISION REQUIRED` at bootstrap
9. Behavior when an authenticated user has no role assigned:
   `TBD — HUMAN DECISION REQUIRED`
10. Test doubles vs shared non-prod Supabase for integration tests:
    `TBD — HUMAN DECISION REQUIRED`

## Traceability

| Technical design element                  | Maps to FR             | Notes                    |
| ----------------------------------------- | ---------------------- | ------------------------ |
| TDE-001 Access gate / protected CRM shell | FR-001, FR-002, FR-006 | Frontend + session       |
| TDE-002 Supabase Auth sign-in (logical)   | FR-001, FR-006         | Method TBD               |
| TDE-003 Supabase Auth sign-out (logical)  | FR-007, FR-008         |                          |
| TDE-004 Session read                      | FR-002, FR-008         |                          |
| TDE-005 Role read (claims or profile)     | FR-003, FR-004, FR-005 | Store TBD                |
| TDE-006 Role-aware UI                     | FR-004, FR-005         | Concrete CRM actions TBD |
| TDE-007 RLS on application tables         | FR-002, FR-004, FR-005 | Tables/policies TBD      |
| TDE-008 Playwright TC-001–TC-006          | FR-001–FR-008          | Not automated yet        |

Implementation column: empty. No `src/`.

Gaps: TDE-002 cannot be completed until login method is decided.
TDE-005–TDE-007 cannot be completed until role storage and
enforcement are decided. TDE-006 cannot be observed until functional
Q7 is answered or other CRM features exist.
