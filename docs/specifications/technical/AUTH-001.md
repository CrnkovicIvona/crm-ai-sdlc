# TS-AUTH-001: Bank employee login and role-based access

- Work item: AUTH-001
- Functional specification: [../functional/AUTH-001.md](../functional/AUTH-001.md)
- Requirement: [REQ-001](../../requirements/REQ-001.md)
- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Spec PR: [#6](https://github.com/CrnkovicIvona/crm-ai-sdlc/pull/6)
- Decisions: [AUTH-001-decisions.md](../../decisions/AUTH-001-decisions.md)
  (TD-001–TD-008 **APPROVED**)
- Status: **RELEASED** (REL-003). Production smoke 5/5 PASSED
  2026-08-23 against `https://crm-ai-sdlc.vercel.app`. Live Auth e2e
  without secrets is SKIPPED (skipped ≠ passed).
- Implementation plan (approved, **executed**; archive):
  [../../features/AUTH-001/implementation-plan.md](../../features/AUTH-001/implementation-plan.md)
- Author: Agent; technical decisions recorded from human approval
  2026-08-21

**As shipped (do not read the pre-code tense below as current
state):** AUTH-001 is **`RELEASED`**. Application source is under
`src/` (`LoginPage.tsx`, `RequireAuth.tsx`, `access.ts`, `auth.ts`,
`errors.ts`). Non-prod SQL:
`supabase/migrations/20260822150000_profiles.sql` (human applies;
agent does not apply to production). This TS remains the approved
design. Sentences such as “no `src/` yet” describe **specification
time**, not `main` after REL-003.

This document is the **technical specification**: how approved
AUTH-001 functionality is implemented. It was written before `src/`
existed; it does not itself create files.

Business rules stay in the functional specification. Enforcement
(RLS, route guards, Supabase client) is described here.

## Architecture

### Approved platform

| Decision                             | Status                                                                        | Source           |
| ------------------------------------ | ----------------------------------------------------------------------------- | ---------------- |
| TypeScript                           | Accepted                                                                      | ADR-0001         |
| React                                | Accepted                                                                      | ADR-0001         |
| Vite as hosting/bundler              | Accepted                                                                      | ADR-0002, TD-001 |
| React Router                         | Accepted for AUTH-001                                                         | TD-002           |
| Supabase PostgreSQL and Auth         | Accepted; **shipped** (non-prod project; agent does not configure production) | ADR-0001, TD-003 |
| Vitest, Playwright, ESLint, Prettier | Accepted                                                                      | ADR-0001         |
| GitHub Actions, Vercel later         | Accepted intent                                                               | ADR-0001         |
| Custom REST API for AUTH-001         | **Not required**                                                              | TD-006           |

At specification time no application source existed. After REL-003,
`src/` and the `profiles` migration exist (see **As shipped** above).

### Application layers (logical; not built)

1. **Presentation** — Vite React UI: login, logout, CRM shell,
   role-aware presentation (TD-001).
2. **Client application logic** — Supabase Auth session, React Router
   guards, role read from `profiles` (TD-002, TD-003, TD-004, TD-007).
3. **Backend-as-a-service** — Supabase Auth and PostgreSQL. No custom
   REST/GraphQL/Edge Function layer for AUTH-001 (TD-006).
4. **Data** — PostgreSQL. Logical `profiles` only. **No migration in
   this phase** (TD-004).

Frontend/backend boundary: browser uses public Supabase URL and anon
key. Service role key must never ship in the client
(environments.md).

### Relevant modules (logical; no source files)

| Logical module | Responsibility                                    | TD             |
| -------------- | ------------------------------------------------- | -------------- |
| Auth session   | Email/password sign-in, sign-out, current session | TD-003, TD-007 |
| Role access    | Read ADMIN vs VIEWER from `profiles`              | TD-004         |
| Access gate    | React Router: public login, protected CRM         | TD-002, TD-005 |
| Role-aware UI  | UX for BD-006; not the security boundary          | TD-005         |

Physical paths: see
[implementation-plan.md](../../features/AUTH-001/implementation-plan.md).

### Request / data flow

Unauthenticated CRM access:

```
Person → protected CRM route → React Router guard → login route (FR-002, FR-010)
```

Login:

```
Employee → /login (email + password) → Supabase Auth sign-in
        → session → CRM allowed (FR-001, FR-012)
```

Authorized use (when CRM resources exist later):

```
Authenticated user → CRM UI (UX checks) → Supabase client
                  → PostgreSQL RLS (security boundary) (TD-005, BD-006)
```

Logout:

```
Authenticated user → sign-out (Supabase) → session ended
                  → CRM denied until login (FR-008, TD-007)
```

### Authentication flow

**Approved:** Supabase Auth, email + password, SPA client session
(TD-001, TD-003, TD-007, BD-001).

```
Vite React client → supabase.auth.signInWithPassword
                 → session managed by Supabase Auth
                 → supabase.auth.signOut on logout
```

### Authorization flow

**Approved (TD-005):**

1. Frontend route/UI checks for UX (never sole security).
2. PostgreSQL RLS as the data-security boundary for **persisted CRM
   data**.

AUTH-001 persists identity (Auth) and role (`profiles`). There are
**no** CRM resource tables yet. RLS on future CRM tables must
implement BD-006 (ADMIN read+write, VIEWER read only). Logical RLS
for `profiles` is below. **Do not create policies now.**

## Frontend

Vite + React + TypeScript (ADR-0002, TD-001). React Router (TD-002).

### Pages / routes (logical)

| Logical route        | Path (approved) | Audience           | Purpose                |
| -------------------- | --------------- | ------------------ | ---------------------- |
| Login                | `/login`        | Unauthenticated    | Email + password login |
| Protected CRM routes | _(not named)_   | Authenticated only | CRM functionality      |
| Logout               | action          | Authenticated      | End session            |

Do not invent final CRM path names (TD-002). Unauthenticated access
to protected routes redirects to `/login` (FR-010).

### Components (logical; not created)

| Component                     | Responsibility                                    |
| ----------------------------- | ------------------------------------------------- |
| Login form                    | Email, password, submit; generic failure (FR-009) |
| Logout control                | Supabase sign-out (FR-007)                        |
| Protected route / access gate | Block CRM when unauthenticated                    |
| CRM shell                     | Authenticated frame                               |
| Role-aware region             | UX: hide/disable writes for VIEWER (BD-006)       |

### Forms and validation

- Fields: email, password (BD-001).
- Do not invent password-complexity rules.
- Failed submit: generic authentication failure; same outcome whether
  the email is unknown or the password is wrong (BD-004).

### State management

Session from the **Supabase Auth client** (TD-007). No extra global
store is approved.

Login loading: show in-progress vs failed vs success without
inventing copy beyond generic failure.

### Protected routes

React Router guards on CRM routes (TD-002, TD-005). Unauthenticated
users are sent to `/login`. Frontend guards are UX only.

### Role-aware UI behavior

- ADMIN: UI may offer permitted write actions when such CRM
  resources exist (FR-004).
- VIEWER: UI must not present write actions as available (FR-005).
- AUTH-001 has no CRM resource screens; role-aware UI is still
  required on any future resource in this model.
- UI is not a substitute for RLS (TD-005).

## Supabase

| Service                           | AUTH-001                        | Configured now |
| --------------------------------- | ------------------------------- | -------------- |
| Supabase Auth                     | Email/password; session; logout | No             |
| PostgreSQL                        | `profiles` concept; future CRM  | No             |
| Storage, Realtime, Edge Functions | Not required (TD-006)           | No             |

### Authentication flow (technical)

`signInWithPassword` → session → `getSession` / `onAuthStateChange` →
`signOut`.

### Authorization model

Application role is **not** taken from client-editable user metadata
as the source of truth. Source of truth: **`profiles.role`** (TD-004).

### Client / server boundaries

- **Client (anon key):** sign-in, sign-out, session, SELECT own
  profile as allowed by future RLS.
- **Provisioning:** external (BD-002). Service role / dashboard /
  admin processes are outside AUTH-001 UI. Service role must not be
  in the client.

## Database

Logical schema only. **Do not create tables or SQL migrations.**

### Supabase-managed

`auth.users` (and related Auth schema) is owned by Supabase Auth.

### Application concept: `profiles` (TD-004)

1:1 with `auth.users.id`. Exactly one of ADMIN or VIEWER (BD-003).

| Column     | Type            | Required | Description                   |
| ---------- | --------------- | -------- | ----------------------------- |
| id         | UUID            | yes      | PK; equals `auth.users.id`    |
| role       | ADMIN \| VIEWER | yes      | Application role; exactly one |
| created_at | timestamptz     | yes      | Created                       |
| updated_at | timestamptz     | yes      | Last change                   |

- Primary key: `id`
- Foreign key (logical): `id` → `auth.users.id`
- Unique: one profile per auth user
- Constraint (logical): `role` in (`ADMIN`, `VIEWER`); not both
- No other AUTH-001 tables. No CRM resource tables.

## Row Level Security

**Do not create policies.** Design intent (TD-005):

| Table                      | RLS          | SELECT                                                                                  | INSERT / UPDATE / DELETE                                           |
| -------------------------- | ------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `auth.*`                   | Auth-managed | Do not author policies here                                                             |                                                                    |
| `profiles`                 | Yes          | Authenticated user may SELECT **own** row (`id` = auth user id) so the UI can read role | Not via AUTH-001 end-user UI (BD-002). Changes are external/admin. |
| Future CRM resource tables | Yes          | VIEWER and ADMIN: permitted reads; ADMIN: permitted writes; VIEWER: no writes (BD-006)  | Specified when those tables exist                                  |

Frontend checks must never be treated as the sole security mechanism.

## API / RPC / Data Access

**Approved (TD-006):** Supabase Auth APIs and Supabase client/data
access. No custom REST API for AUTH-001. This is not a project-wide
ban on future APIs.

### Interface: sign in

| Field                   | Value                                                 |
| ----------------------- | ----------------------------------------------------- |
| Method / type           | Supabase Auth `signInWithPassword`                    |
| Logical name            | `auth.signIn`                                         |
| Purpose                 | Authenticate (FR-012, FR-006)                         |
| Authentication required | No                                                    |
| Authorization required  | N/A                                                   |
| Request parameters      | email, password                                       |
| Response                | Session on success; no session on failure             |
| Validation              | Email and password present; no extra complexity rules |
| Errors                  | Generic failure; no account enumeration (FR-009)      |

### Interface: sign out

| Field                   | Value                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------- |
| Method / type           | Supabase Auth `signOut`                                                               |
| Logical name            | `auth.signOut`                                                                        |
| Purpose                 | End session (FR-007, FR-008)                                                          |
| Authentication required | Yes                                                                                   |
| Authorization required  | Any authenticated role                                                                |
| Request parameters      | None                                                                                  |
| Response                | No authenticated session                                                              |
| Validation              | N/A                                                                                   |
| Errors                  | If sign-out fails, CRM access must not remain granted; details in implementation plan |

**As-shipped (REL-003, not a product-scope change):**
`src/lib/auth.ts` calls Supabase `signOut({ scope: 'local' })`.
That ends this browser’s session (FR-008). Global revoke of other
devices is out of AUTH-001; concurrent sessions were unspecified.
Do not reopen AUTH-001 to change sign-out scope.

### Interface: current session / user

| Field                   | Value                                            |
| ----------------------- | ------------------------------------------------ |
| Method / type           | Supabase Auth session                            |
| Logical name            | `auth.getSession`                                |
| Purpose                 | Drive route guards (FR-002, FR-010)              |
| Authentication required | Session may be absent                            |
| Authorization required  | N/A                                              |
| Request parameters      | None                                             |
| Response                | Current user or unauthenticated                  |
| Validation              | N/A                                              |
| Errors                  | Treat missing/invalid session as unauthenticated |

### Interface: read role

| Field                   | Value                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| Method / type           | Supabase client SELECT on `profiles`                                                                      |
| Logical name            | `profiles.readOwnRole`                                                                                    |
| Purpose                 | ADMIN vs VIEWER (FR-003–FR-005, FR-011)                                                                   |
| Authentication required | Yes                                                                                                       |
| Authorization required  | Own profile only (logical RLS)                                                                            |
| Request parameters      | Implicit current user id                                                                                  |
| Response                | `ADMIN` or `VIEWER`                                                                                       |
| Validation              | Role is exactly one of the two values                                                                     |
| Errors                  | Missing or unusable profile/role: deny protected CRM (BD-008, FR-013). No provisioning UI. Copy deferred. |

No `POST /login`.

## Security

| Control          | AUTH-001 treatment                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| Authentication   | Supabase Auth email/password (TD-003, BD-001)                                                                         |
| Authorization    | UI/route UX + RLS data boundary (TD-005, BD-006)                                                                      |
| Session          | Supabase-managed; logout required; timeout deferred (TD-007, BD-005)                                                  |
| Input validation | Email + password present                                                                                              |
| Access control   | `/login` public; CRM routes protected                                                                                 |
| RLS              | `profiles` SELECT-own shipped in non-prod SQL; CRM table RLS is CRM-001                                               |
| Sensitive data   | No secrets in repo; no service role in client                                                                         |
| Error disclosure | Generic failure; no account enumeration (BD-004)                                                                      |
| Logout           | `signOut` must end CRM access (FR-008). As shipped: local scope only (this browser); not a global multi-device revoke |

Security review remains required at High risk before
`READY_FOR_PR` of a future implementation.

## Testing Architecture

At specification time: no tests executed in that phase. After
REL-003: unit `tests/unit/errors.test.ts`,
`tests/unit/require-auth.test.ts`; e2e `tests/e2e/auth.spec.ts`,
`tests/e2e/roles.spec.ts`; smoke `tests/smoke/rel-003.spec.ts`.
Live Auth e2e without secrets is SKIPPED (skipped ≠ passed).

| Layer            | Tool               | AUTH-001                                                                                   |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| Unit             | Vitest             | Guards, generic-error mapping, role presentation                                           |
| Integration      | Vitest             | Auth client; `profiles` read against non-prod or doubles (strategy in implementation plan) |
| Data access      | Vitest             | Supabase client; not REST                                                                  |
| Authorization    | Vitest + e2e       | ADMIN vs VIEWER; RLS when policies exist                                                   |
| E2E              | Playwright         | TC-001–TC-009                                                                              |
| Static analysis  | ESLint             | When `src/` exists                                                                         |
| Format / secrets | Prettier, gitleaks | Foundation CI                                                                              |

Until `src/` exists: ESLint, Vitest, Playwright are **NOT
APPLICABLE**.

## Dependencies

| Dependency            | Kind          | Notes                                                      |
| --------------------- | ------------- | ---------------------------------------------------------- |
| ADR-0001              | Architecture  | Process, CI, Supabase/Vercel intent, toolchain             |
| ADR-0002              | Architecture  | Vite + React + TypeScript                                  |
| environments.md       | Architecture  | Secrets, topology                                          |
| FS-AUTH-001 / REQ-001 | Functional    | Must match BD-\*                                           |
| US/AC/BDD/TC          | Specification | Test mapping                                               |
| Configured Supabase   | Runtime       | Needed to **run** implementation; not created in this step |
| Vercel project        | Runtime       | Hosted Preview later; local Vite can be planned without it |

## Open Technical Questions

Resolved: former items 1–3, 5–7 (TD-001–TD-008, BD-001, BD-008).

**Deferred, not blocking specification of AUTH-001:**

1. Exact `.env` variable names — at bootstrap in the implementation
   plan (families in environments.md; Vite public prefix).
2. Integration tests: doubles vs shared non-prod Supabase —
   implementation plan.
3. Exact file/folder layout under `src/` — implementation plan.
4. Exact login/failure copy — functional (generic only).
5. Automatic session expiration — BD-005 deferred.
6. Concrete RLS SQL and CRM table policies — when tables are
   implemented in `PLANNED` / future features.
7. UX copy when CRM is denied for missing profile — deferred (behavior is deny).

## Traceability

| TDE     | Maps to FR                             | TD / notes                                                |
| ------- | -------------------------------------- | --------------------------------------------------------- |
| TDE-001 | FR-001, FR-002, FR-006, FR-010, FR-013 | React Router guards (TD-002, TD-005, TD-008)              |
| TDE-002 | FR-006, FR-012, FR-009                 | `signInWithPassword` (TD-003, BD-001, BD-004)             |
| TDE-003 | FR-007, FR-008                         | `signOut` (TD-007)                                        |
| TDE-004 | FR-002, FR-008, FR-010                 | Session read (TD-007)                                     |
| TDE-005 | FR-003, FR-004, FR-005, FR-011         | `profiles` read (TD-004)                                  |
| TDE-006 | FR-004, FR-005                         | Role-aware UI UX (TD-005); no CRM modules yet             |
| TDE-007 | FR-004, FR-005, FR-011                 | RLS design for `profiles` and future CRM data (TD-005)    |
| TDE-008 | FR-001–FR-013                          | Playwright TC-001–TC-009; AC-012 unit (test architecture) |

Implementation: Vite + React under `src/` (ADR-0002). Auth client:
`src/lib/supabase.ts`, `src/lib/auth.ts`, `src/lib/profile.ts`. Guards:
`src/lib/access.ts`, `src/auth/RequireAuth.tsx`. Tests:
`tests/unit/`, `tests/e2e/auth.spec.ts`, `tests/e2e/roles.spec.ts`.
SQL: `supabase/migrations/20260822150000_profiles.sql` (non-prod).
