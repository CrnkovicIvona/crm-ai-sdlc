# AUTH-001 decision log

- Work item: AUTH-001
- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Spec PR: [#6](https://github.com/CrnkovicIvona/crm-ai-sdlc/pull/6)
- Date: 2026-08-21
- Deciders: Human (AUTH-001 human decision update)
- Related ADRs: [ADR-0001](../adr/0001-engineering-foundation.md),
  [ADR-0002](../adr/0002-vite-react-typescript.md)
- Status of this log: **APPROVED** (BD-001–BD-008, TD-001–TD-008)

This file records **why** AUTH-001 decisions were made. It is not an
ADR except where a durable platform choice was extracted to ADR-0002
(TD-001).

These approvals do **not** authorize implementation, a `feature/`
branch, `src/`, migrations, RLS policies, APIs, deploy, or Definition
of Ready.

---

## Business/Product Decisions

### BD-001 Authentication

| Field          | Value                                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID    | BD-001                                                                                                                                                   |
| Decision       | How a bank employee proves identity for AUTH-001                                                                                                         |
| Approved value | Bank employees authenticate using **email and password**. SSO and MFA are out of scope for AUTH-001. (Supabase Auth is the technical mechanism: TD-003.) |
| Rationale      | First increment needs a concrete identity method without SSO/MFA.                                                                                        |
| Scope impact   | In: email + password login. Out: SSO, MFA, magic link, OAuth, password reset.                                                                            |
| Status         | **APPROVED**                                                                                                                                             |

### BD-002 Provisioning

| Field          | Value                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Decision ID    | BD-002                                                                                                                 |
| Decision       | Whether AUTH-001 includes creating employees and assigning roles in the product                                        |
| Approved value | AUTH-001 does **not** include in-app employee provisioning. Provisioning is an external/system administration concern. |
| Rationale      | Login and role enforcement do not require a provisioning UI.                                                           |
| Scope impact   | Identities and roles exist out of band. No in-app account admin.                                                       |
| Status         | **APPROVED**                                                                                                           |

### BD-003 Role model

| Field          | Value                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Decision ID    | BD-003                                                                                                   |
| Decision       | How many application roles one employee may hold                                                         |
| Approved value | Exactly **one** role per employee: **ADMIN** or **VIEWER**. An employee cannot have both simultaneously. |
| Rationale      | Two named roles; combination was unspecified. Single role is testable.                                   |
| Scope impact   | No dual-role users. Role assignment remains provisioning (BD-002).                                       |
| Status         | **APPROVED**                                                                                             |

### BD-004 Failed login

| Field          | Value                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Decision ID    | BD-004                                                                                                                    |
| Decision       | What the product does when authentication fails                                                                           |
| Approved value | Generic authentication failure message. Must **not** reveal whether a particular account exists. Lockout is out of scope. |
| Rationale      | Avoids inventing lockout policy and avoids account enumeration. Exact wording is not specified.                           |
| Scope impact   | In: one unsuccessful-login outcome. Out: lockout, distinct “unknown email” vs “wrong password” messages.                  |
| Status         | **APPROVED**                                                                                                              |

### BD-005 Session behavior

| Field          | Value                                                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID    | BD-005                                                                                                                                                                           |
| Decision       | When authenticated CRM access ends                                                                                                                                               |
| Approved value | Explicit logout terminates authenticated access. AUTH-001 does **not** define automatic session-timeout. Automatic expiration is deferred to a future security/session decision. |
| Rationale      | Logout was already required. Timeout duration was not specified.                                                                                                                 |
| Scope impact   | In: logout then deny CRM until login. Out: idle/absolute timeout, remember-me.                                                                                                   |
| Status         | **APPROVED**                                                                                                                                                                     |

### BD-006 Authorization model

| Field          | Value                                                                                                                                                                                                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID    | BD-006                                                                                                                                                                                                                                                                                                                          |
| Decision       | Meaning of ADMIN vs VIEWER access                                                                                                                                                                                                                                                                                               |
| Approved value | **ADMIN** may perform permitted CRM **read** operations and permitted CRM **write** operations. **VIEWER** may perform permitted CRM **read** operations and **may not** perform CRM **write** operations. AUTH-001 does **not** introduce CRM business resources or CRUD modules. Future CRM resources must follow this model. |
| Rationale      | Makes “full” vs “read-only” a permission model without inventing modules.                                                                                                                                                                                                                                                       |
| Scope impact   | No customers/accounts/other modules in AUTH-001. Observable writes wait for future resources.                                                                                                                                                                                                                                   |
| Status         | **APPROVED**                                                                                                                                                                                                                                                                                                                    |

### BD-007 Unauthenticated access

| Field          | Value                                                                                                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID    | BD-007                                                                                                                                                                                              |
| Decision       | What an unauthenticated person may access                                                                                                                                                           |
| Approved value | Unauthenticated users may access **only the login surface**. CRM functionality requires authentication. After explicit logout, the user must authenticate again before accessing CRM functionality. |
| Rationale      | Matches “only authenticated users may access the CRM” plus logout.                                                                                                                                  |
| Scope impact   | Public: login only. Protected: CRM.                                                                                                                                                                 |
| Status         | **APPROVED**                                                                                                                                                                                        |

### BD-008 Missing profile or role

| Field          | Value                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------- |
| Decision ID    | BD-008                                                                                          |
| Decision       | Access when an Auth session exists but `profiles` or a usable role does not                     |
| Approved value | Fail closed: **deny protected CRM access**. No provisioning UI. Exact UX copy is not specified. |
| Rationale      | High-risk authorization must not admit a session without a role. Recorded 2026-08-22.           |
| Status         | **APPROVED**                                                                                    |

---

## Technical Decisions

### TD-001 Frontend architecture

| Field          | Value                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------- |
| Decision ID    | TD-001                                                                                       |
| Decision       | React hosting/tooling                                                                        |
| Approved value | **Vite + React + TypeScript**. Recorded as [ADR-0002](../adr/0002-vite-react-typescript.md). |
| Rationale      | Closes the ADR-0001 framework deferral so AUTH-001 can be planned.                           |
| Scope impact   | SPA bootstrap when `PLANNED`. No `src/` from this decision.                                  |
| Status         | **APPROVED**                                                                                 |

### TD-002 Routing

| Field          | Value                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Decision ID    | TD-002                                                                                                                   |
| Decision       | Public vs protected screens                                                                                              |
| Approved value | **React Router**. Public **login route** and **protected CRM routes**. No final CRM path names beyond that architecture. |
| Rationale      | SPA routing for BD-007.                                                                                                  |
| Scope impact   | `/login` is the public login route. Other CRM URLs wait for the implementation plan.                                     |
| Status         | **APPROVED**                                                                                                             |

### TD-003 Authentication

| Field          | Value                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Decision ID    | TD-003                                                                                            |
| Decision       | Auth service and client                                                                           |
| Approved value | **Supabase Auth** using the approved **Supabase client** architecture (public URL + anon key).    |
| Rationale      | Matches ADR-0001 / environments intent and BD-001.                                                |
| Scope impact   | Requires a configured Supabase project before runtime; not configured by this documentation step. |
| Status         | **APPROVED**                                                                                      |

### TD-004 Role storage

| Field          | Value                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID    | TD-004                                                                                                                                                                                  |
| Decision       | Where ADMIN vs VIEWER is stored                                                                                                                                                         |
| Approved value | Dedicated **`profiles` concept**, 1:1 with `auth.users.id`. Roles: ADMIN, VIEWER only. Logical schema in the technical specification. **Do not create the table or SQL migration yet.** |
| Rationale      | Application role separate from Auth-managed identity.                                                                                                                                   |
| Scope impact   | Schema is design-only until `PLANNED`.                                                                                                                                                  |
| Status         | **APPROVED**                                                                                                                                                                            |

### TD-005 Authorization enforcement

| Field          | Value                                                                                                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision ID    | TD-005                                                                                                                                                                                                                        |
| Decision       | Where permissions are enforced                                                                                                                                                                                                |
| Approved value | Two layers: (1) frontend route/UI authorization for UX; (2) **PostgreSQL RLS** as the data-security boundary for persisted CRM data. Frontend checks are **never** the sole security mechanism. **Do not implement RLS yet.** |
| Rationale      | UI hiding is not access control.                                                                                                                                                                                              |
| Scope impact   | AUTH-001 has no CRM resource tables. RLS on `profiles` is specified logically; policies are not created now.                                                                                                                  |
| Status         | **APPROVED**                                                                                                                                                                                                                  |

### TD-006 Data access

| Field          | Value                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Decision ID    | TD-006                                                                                                                                                                               |
| Decision       | How AUTH-001 talks to auth and data                                                                                                                                                  |
| Approved value | **Supabase Auth APIs** and **Supabase client/data access** are sufficient. AUTH-001 does **not** require a custom REST API. This is **not** a project-wide ban on future API layers. |
| Rationale      | Avoids inventing HTTP endpoints for login.                                                                                                                                           |
| Scope impact   | AUTH-001 only. Future features may add APIs if required.                                                                                                                             |
| Status         | **APPROVED**                                                                                                                                                                         |

### TD-007 Session

| Field          | Value                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Decision ID    | TD-007                                                                                                                   |
| Decision       | Who manages the authenticated session                                                                                    |
| Approved value | Session management is **delegated to Supabase Auth**. AUTH-001 requires logout to terminate CRM access (BD-005, BD-007). |
| Rationale      | Matches TD-003 and Vite SPA (TD-001).                                                                                    |
| Scope impact   | No custom session store. Timeout policy remains deferred (BD-005).                                                       |
| Status         | **APPROVED**                                                                                                             |

### TD-008 Fail-closed gate

| Field          | Value                                                                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Decision ID    | TD-008                                                                                                                                                                                                             |
| Decision       | How BD-008 is enforced in the access gate                                                                                                                                                                          |
| Approved value | Protected CRM routes require a usable `profiles.role` (ADMIN or VIEWER). Missing profile or unusable role → **deny protected CRM access**. Login surface may remain. Not implemented in this documentation change. |
| Status         | **APPROVED**                                                                                                                                                                                                       |
