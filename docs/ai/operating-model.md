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
| Code         | `src/`                                             | Implementation after `PLANNED`       |
| CI           | `.github/workflows/`                               | Quality gates; release→`test` sync   |

`ui-ux-redesign` (`.cursor/skills/ui-ux-redesign/SKILL.md`) writes
**layout/copy proposals** for screens that already exist. It does not
open DASH-001 or new CRM entities. Applying a restyle waits for PO
selection. CRM-001 output:
[../features/CRM-001/ui-ux-proposal.md](../features/CRM-001/ui-ux-proposal.md).

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
code review, commit messages, PR preparation, UX/UI **proposals** for
existing screens (`ui-ux-redesign`; PO must select before CSS).

## Forbidden

See [README.md](README.md). Runtime guardrails:
`.cursor/rules/ai-guardrails.mdc`. Do not duplicate that list in
[guardrails.md](guardrails.md).
