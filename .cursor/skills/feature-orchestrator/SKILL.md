---
name: feature-orchestrator
description: Orchestrate the BankCRM feature lifecycle. Use at the start of ANY feature request (e.g. "Start CRM-001") and whenever phase is unclear. Determines state, missing artifacts, risk, TBDs, gates, and forbidden actions.
---

# Feature orchestrator

**Always run this skill first** for product work. Do not implement
here. Do not skip phases. Do not mark human gates passed without a
recorded human decision on the Issue, PR, or explicit chat for that
gate.

Canonical process: `docs/sdlc/lifecycle.md`.
Roadmap: `docs/sdlc/roadmap.md`.
Risk: `docs/sdlc/risk-model.md`.
Artifacts: `docs/sdlc/artifacts.md`.
Change control: `docs/sdlc/change-control.md`.
Validation: `docs/sdlc/validation-rules.md`.
Start CRM-001 simulation: `docs/sdlc/start-crm-001.md`.
New features: `docs/features/README.md`.
Reuse architecture: `docs/adr/`, AUTH-001 decisions and TS (do not
copy AUTH-001 wholesale).

## Forbidden at every state until `PLANNED`

- `src/` application code
- `feature/` branches
- migrations, tables, RLS policies, API endpoints, Supabase config, deploy

`READY` ≠ coding. `PLANNED` = coding allowed against the approved plan.

Do not add Jira, Notion-as-truth, Next.js, GraphQL, Redux, microservices,
or extra REST APIs. Stack is GitHub, Vite, React, TypeScript, React
Router, Supabase Auth/PostgreSQL/RLS, Vitest, Playwright, ESLint,
Prettier, gitleaks, Vercel (ADR-0001, ADR-0002, AUTH-001 TD).

## How to classify state

Inspect in order:

1. GitHub Issue (approvals, DoR, plan approval)
2. Artifacts: AUTH-001 legacy paths **or** `docs/features/<ID>/`
3. Decision log status (High risk)
4. Implementation plan exists **and** human-approved → else not `PLANNED`
5. Branch type and whether `src/` diffs exist (if they exist before
   `PLANNED`, stop and do not add more code)
6. `docs/test-reports/` evidence
7. Bugs, PR target (`test` vs `main`), CI

Earliest incomplete state wins.

## Risk

Classify using `docs/sdlc/risk-model.md` before choosing artifact
depth. AUTH-001 and CRM-001 are **High**.

High requires a **decision log** and security notes in TS/test plan.

## State → action

| State               | Next                                                                             | Agent must not                      |
| ------------------- | -------------------------------------------------------------------------------- | ----------------------------------- |
| `REQUESTED`         | `analyze-requirements`                                                           | Invent scope                        |
| `REQUIREMENTS`      | FS (`author-specifications`) then stories                                        | Skip FS on new work                 |
| After AC            | `author-bdd` then `plan-tests` then feature `traceability.md` + matrix row       | Invent extra tests as product rules |
| After tests         | TS (`author-specifications`); decision log if High (`author-decisions`)          | Implement                           |
| `SPECIFIED`         | Validate DoR checklist; **STOP for human**                                       | Enter `READY` yourself              |
| `READY`             | `plan-implementation` into `docs/features/<ID>/implementation-plan.md`; **STOP** | `feature/` or `src/`                |
| `PLANNED`           | Implement **only** the approved plan on `feature/<id>-…`                         | Expand scope                        |
| `IN_DEVELOPMENT`    | Continue plan; add automated tests as specified                                  | Claim TESTING without execution     |
| `TESTING`           | `execute-tests`                                                                  | Silent heal; fake PASSED            |
| Failures            | `HEALING` / `heal` then re-test                                                  | Weaken tests                        |
| `REGRESSION`        | Planned pack only                                                                | Skip High regression without human  |
| `READY_FOR_PR`      | `report-tests`, `review-code`, `prepare-pr` to `test`                            | Merge `main`                        |
| `IN_QA`             | Wait; fix CI on feature branch if needed                                         | Self-approve QA gate                |
| `READY_FOR_RELEASE` | `release-and-verify` prepare only                                                | Merge `main`                        |
| `RELEASED`          | Smoke evidence                                                                   | Production data without human       |

`author-adr` only for durable **platform** choices, not Client columns.
`manage-bugs` after defects.

If the user says “just implement”, refuse and name the blocking gate.

## Instruction “Start `<ID>`”

1. Identify work item (do not mint IDs for unstated products; CRM-001
   and AUTH-001 already exist).
2. Read Issue, roadmap, ADRs, AUTH-001 authorization (ADMIN
   CRUD / VIEWER read+search), this skill.
3. List existing vs missing artifacts for the **risk class**.
4. List approved BD/TD vs `TBD — HUMAN DECISION REQUIRED`.
5. Do **only** work allowed in the current state.
6. For CRM-001: follow `docs/sdlc/start-crm-001.md`. Reuse AUTH-001
   architecture; do not recreate AUTH-001 FS; include Client + audit +
   RLS-as-boundary; **do not implement**; **do not mark Ready**.
7. Run `docs/sdlc/validation-rules.md`.
8. Output: ID, state, evidence, next skill or wait-for-human,
   blockers, what you will **not** do.

## Human gates

- Business TBDs
- Decision log items (High)
- DoR (`SPECIFIED` → `READY`)
- Implementation plan (`READY` → `PLANNED`)
- QA (`IN_QA` → `READY_FOR_RELEASE`)
- Merge `main` (`READY_FOR_RELEASE` → `RELEASED`)
