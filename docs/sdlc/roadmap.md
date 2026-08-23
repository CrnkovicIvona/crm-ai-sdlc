# Product roadmap

BankCRM is a **simple professional CRM** used to demonstrate an
agentic SDLC. GitHub + `docs/` are the source of truth.

## Increments (do not reorder)

| ID       | Meaning                                                  | Spec location                                     | State                                                                       |
| -------- | -------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- |
| AUTH-001 | Login, roles, logout, fail-closed access                 | `docs/requirements/REQ-001.md` and AUTH-001 specs | **`RELEASED`** (REL-003; smoke 5/5 PASS)                                    |
| CRM-001  | Client + Product catalog + optional assign + soft-delete | [../features/CRM-001/](../features/CRM-001/)      | **`PLANNED`** (Gate 2 **revised** 2026-08-23; implementing; not `RELEASED`) |
| DASH-001 | Dashboard after Clients exist                            | Not specified                                     | Not started                                                                 |

1. **AUTH-001** — **`RELEASED`**. Code is on `main` (REL-003). Production
   smoke 5/5 PASSED 2026-08-23 (`https://crm-ai-sdlc.vercel.app`; no
   1b). Paths stay under
   `docs/requirements/` and related AUTH-001 files. Plan:
   [../features/AUTH-001/implementation-plan.md](../features/AUTH-001/implementation-plan.md).
   Live Auth e2e without secrets is **SKIPPED** (skipped ≠ passed).
   Do not migrate AUTH-001 into `docs/features/` without an explicit
   docs task.
2. **CRM-001** — **`PLANNED`**. Client + fixed Product catalog +
   optional ClientProduct + soft-delete. Authorization reuses AUTH-001.
   Audit trail is **in** CRM-001 via a DB trigger.
   Plan:
   [../features/CRM-001/implementation-plan.md](../features/CRM-001/implementation-plan.md)
   (**Approved**). Implementation PR targets `test` (Gate 3). Human
   applies the non-prod migration. Do not merge `main` as agent.
   UX/UI **proposals** for existing AUTH+CRM screens (no new features):
   `.cursor/skills/ui-ux-redesign/SKILL.md` and
   [../features/CRM-001/ui-ux-proposal.md](../features/CRM-001/ui-ux-proposal.md)
   (**Proposed** until PO selects). Not a new roadmap ID; not DASH-001.
3. **DASH-001** — simple statistics **after** Clients exist. Do not
   specify or implement until CRM-001 is accepted for planning.

Do not add Jira, Azure DevOps, Notion-as-truth, Datadog, paid IdP,
GraphQL, Redux, microservices, extra REST APIs, or Next.js.
