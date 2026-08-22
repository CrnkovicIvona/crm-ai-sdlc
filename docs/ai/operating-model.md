# AI operating model

Cursor is the AI-assisted development environment. GitHub holds source
and collaboration. Humans remain accountable for product truth and
production.

## Separation of concerns

| Kind         | Location                                           | Role                                 |
| ------------ | -------------------------------------------------- | ------------------------------------ |
| Rules        | `.cursor/rules/`                                   | Persistent constraints               |
| Skills       | `.cursor/skills/`                                  | Procedures for one activity          |
| SDLC         | `docs/sdlc/`                                       | Lifecycle orchestration              |
| Product      | `docs/product/`                                    | Business truth                       |
| Specs        | `docs/features/` + `docs/specifications/`          | Feature packs (new) / AUTH-001 specs |
| Decisions    | `docs/decisions/` + `docs/features/*/decisions.md` | Feature BD/TD                        |
| QA artifacts | `docs/test-*`, `docs/bugs/`, feature test files    | Design and evidence                  |
| Code         | `src/` (later)                                     | Implementation                       |
| CI           | `.github/workflows/`                               | Automation                           |

## Orchestration

Start with `.cursor/skills/feature-orchestrator/SKILL.md` for every
feature (including “Start CRM-001”). Canonical process:
[../sdlc/lifecycle.md](../sdlc/lifecycle.md). It **must not** skip
human gates. `READY` is not coding; `PLANNED` is.

`execute-tests` and `heal` are separate: evidence vs remediation.

## Allowed assistance

Requirements analysis, functional and technical specifications,
decision logs (Proposed), stories, AC, BDD, test design, test planning,
implementation planning (after Ready), coding (after PLANNED),
unit/integration/Playwright tests,
execution, failure analysis, healing, regression analysis, reports,
code review, commit messages, PR preparation.

## Forbidden

See [guardrails.md](guardrails.md) and `.cursor/rules/ai-guardrails.mdc`.
