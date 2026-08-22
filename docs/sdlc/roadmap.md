# Product roadmap

BankCRM is a **simple professional CRM** used to demonstrate an
agentic SDLC. GitHub + `docs/` are the source of truth.

## Increments (do not reorder)

1. **AUTH-001** — login, roles, logout, fail-closed access. State:
   `SPECIFIED` until a **human** records Ready. Paths:
   `docs/requirements/REQ-001.md` and related AUTH-001 files. Do not
   migrate these into `docs/features/` without an explicit docs task.
2. **CRM-001** — Client entity only. Paths:
   `docs/features/CRM-001/`. Authorization reuses AUTH-001
   (ADMIN write, VIEWER read/search). Audit trail is **in** CRM-001.
3. **DASH-001** — simple statistics **after** Clients exist. Do not
   specify or implement until CRM-001 is accepted for planning.

Do not add Jira, Azure DevOps, Notion-as-truth, Datadog, paid IdP,
GraphQL, Redux, microservices, extra REST APIs, or Next.js.
