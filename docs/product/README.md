# Product

This directory points at **business/product truth** for BankCRM.

BankCRM is a simple professional CRM demonstrating an agentic SDLC.
Roadmap order: AUTH-001 → CRM-001 → DASH-001
([../sdlc/roadmap.md](../sdlc/roadmap.md)).

## Current approved product increments

| ID       | Meaning                                   | Spec location                                     | State                                            |
| -------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| AUTH-001 | Login, roles, logout, fail-closed access  | `docs/requirements/REQ-001.md` and AUTH-001 specs | **`READY`** (DoR on #5; plan draft; not PLANNED) |
| CRM-001  | Client entity, authorization, audit trail | [../features/CRM-001/](../features/CRM-001/)      | `SPECIFIED` (not Ready; not implemented)         |
| DASH-001 | Dashboard after Clients exist             | Not specified                                     | Not started                                      |

Do not invent modules, personas, or fields beyond approved decision
logs. Unknowns: `TBD — HUMAN DECISION REQUIRED`.

Canonical process: [../sdlc/lifecycle.md](../sdlc/lifecycle.md).
New feature “what”: `docs/features/<ID>/functional-spec.md`.
AUTH-001 “what”: [../specifications/functional/AUTH-001.md](../specifications/functional/AUTH-001.md).
