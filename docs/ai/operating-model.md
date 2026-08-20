# AI operating model

Cursor is the AI-assisted development environment. GitHub holds source
and collaboration. Humans remain accountable for product truth and
production.

## Separation of concerns

| Kind         | Location                    | Role                        |
| ------------ | --------------------------- | --------------------------- |
| Rules        | `.cursor/rules/`            | Persistent constraints      |
| Skills       | `.cursor/skills/`           | Procedures for one activity |
| SDLC         | `docs/sdlc/`                | Lifecycle orchestration     |
| Product      | `docs/product/`             | Business truth              |
| QA artifacts | `docs/test-*`, `docs/bugs/` | Evidence                    |
| Code         | `src/` (later)              | Implementation              |
| CI           | `.github/workflows/`        | Automation                  |

## Orchestration

Start with `.cursor/skills/feature-orchestrator/SKILL.md`. It selects
the next skill from the lifecycle state and **must not** skip human
gates.

`execute-tests` and `heal` are separate: evidence vs remediation.

## Allowed assistance

Requirements analysis, stories, AC, BDD, test design, test planning,
implementation planning, coding, unit/integration/Playwright tests,
execution, failure analysis, healing, regression analysis, reports,
code review, commit messages, PR preparation.

## Forbidden

See [guardrails.md](guardrails.md) and `.cursor/rules/ai-guardrails.mdc`.
