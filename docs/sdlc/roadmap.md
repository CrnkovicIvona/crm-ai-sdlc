# Product roadmap

BankCRM is a **simple professional CRM** used to demonstrate an
agentic SDLC. GitHub + `docs/` are the source of truth.

## Increments (do not reorder)

| ID       | Meaning                                   | Spec location                                     | State                                                       |
| -------- | ----------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| AUTH-001 | Login, roles, logout, fail-closed access  | `docs/requirements/REQ-001.md` and AUTH-001 specs | **`READY_FOR_RELEASE`** (human QA; waiting merge to `main`) |
| CRM-001  | Client entity, authorization, audit trail | [../features/CRM-001/](../features/CRM-001/)      | `SPECIFIED` (not Ready; not implemented)                    |
| DASH-001 | Dashboard after Clients exist             | Not specified                                     | Not started                                                 |

1. **AUTH-001** — **`READY_FOR_RELEASE`**. Paths stay under
   `docs/requirements/` and related AUTH-001 files. Plan:
   [../features/AUTH-001/implementation-plan.md](../features/AUTH-001/implementation-plan.md).
   Live Auth e2e without secrets is **SKIPPED** (skipped ≠ passed).
   Do not migrate AUTH-001 into `docs/features/` without an explicit
   docs task.
2. **CRM-001** — Client entity only. Authorization reuses AUTH-001
   (ADMIN write, VIEWER read/search). Audit trail is **in** CRM-001.
3. **DASH-001** — simple statistics **after** Clients exist. Do not
   specify or implement until CRM-001 is accepted for planning.

Do not add Jira, Azure DevOps, Notion-as-truth, Datadog, paid IdP,
GraphQL, Redux, microservices, extra REST APIs, or Next.js.
