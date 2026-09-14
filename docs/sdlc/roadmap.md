# Product roadmap

BankCRM is a **simple professional CRM** used to demonstrate an
agentic SDLC. GitHub + `docs/` are the source of truth.

## Increments (do not reorder)

| ID       | Meaning                                                  | Spec location                                     | State                                                                               |
| -------- | -------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| AUTH-001 | Login, roles, logout, fail-closed access                 | `docs/requirements/REQ-001.md` and AUTH-001 specs | **`RELEASED`** (REL-003; smoke 5/5 PASS)                                            |
| CRM-001  | Client + Product catalog + optional assign + soft-delete | [../features/CRM-001/](../features/CRM-001/)      | **`RELEASED`** (REL-004 on `main`; REL-005 smoke 7/7 PASS 2026-09-13)               |
| DASH-001 | Dashboard after Clients exist                            | [../features/DASH-001/](../features/DASH-001/)    | **`ON_MAIN`** after REL-006 merge; not `RELEASED` until production smoke **PASSED** |

1. **AUTH-001** — **`RELEASED`**. Code is on `main` (REL-003). Production
   smoke 5/5 PASSED 2026-08-23 (`https://crm-ai-sdlc.vercel.app`; no
   1b). Paths stay under
   `docs/requirements/` and related AUTH-001 files. Plan:
   [../features/AUTH-001/implementation-plan.md](../features/AUTH-001/implementation-plan.md).
   Live Auth e2e without secrets is **SKIPPED** (skipped ≠ passed).
   Do not migrate AUTH-001 into `docs/features/` without an explicit
   docs task.
2. **CRM-001** — **`RELEASED`**. Product on `main` from REL-004.
   REL-005 apply-schema + smoke **PASSED** 2026-09-13
   (`https://crm-ai-sdlc.vercel.app`;
   [run 34753193389](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/34753193389),
   7/7). C008 match oracle still **BLOCKED**. Agent does not merge
   `main`.
   UX/UI **proposals** for existing AUTH+CRM screens (no new features):
   `.cursor/skills/ui-ux-redesign/SKILL.md` and
   [../features/CRM-001/ui-ux-proposal.md](../features/CRM-001/ui-ux-proposal.md)
   (**Proposed** until PO selects). Not a new roadmap ID; not DASH-001.
3. **DASH-001** — **`ON_MAIN`** after REL-006 human merge to `main`.
   Pack: [../features/DASH-001/](../features/DASH-001/). Human DoR
   2026-09-13. Coding approved 2026-09-14. READY_FOR_RELEASE: PO
   2026-09-14. **Not** `RELEASED` until production smoke **PASSED**.

Do not add Jira, Azure DevOps, Notion-as-truth, Datadog, paid IdP,
GraphQL, Redux, microservices, extra REST APIs, or Next.js.
