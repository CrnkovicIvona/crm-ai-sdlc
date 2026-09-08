---
name: feature-orchestrator
description: Orchestrate the BankCRM feature lifecycle. Use at the start of ANY feature request (e.g. "Start CRM-001") and whenever phase is unclear. Determines state, missing artifacts, risk, TBDs, gates, and forbidden actions.
---

# Feature orchestrator

**Always run this skill first** for product work. Do not implement
here. Do not skip phases. Do not mark human gates passed without a
recorded human decision on the Issue, PR, or explicit chat for that
gate.

Canonical process and **Human gates** (do not duplicate the list):
`docs/sdlc/lifecycle.md`.
Roadmap: `docs/sdlc/roadmap.md`.
Risk: `docs/sdlc/risk-model.md`.
Artifacts: `docs/sdlc/artifacts.md`.
Change control: `docs/sdlc/change-control.md`.
Validation: `docs/sdlc/validation-rules.md`.
New features: `docs/features/README.md`.
ADRs: `docs/adr/0001-engineering-foundation.md`,
`docs/adr/0002-vite-react-typescript.md`. Reuse AUTH-001 decisions and
TS; do not copy AUTH-001 wholesale.

## Forbidden at every state until `PLANNED`

- `src/` application code
- `feature/` branches (and `cursor/` implementation aliases)
- migrations, tables, RLS policies, API endpoints, Supabase config, deploy

`READY` ≠ coding. `PLANNED` = coding allowed against the approved plan.

Do not add Jira, Notion-as-truth, Next.js, GraphQL, Redux, microservices,
or extra REST APIs. Stack is GitHub, Vite, React, TypeScript, React
Router, Supabase Auth/PostgreSQL/RLS, Vitest, Playwright, ESLint,
Prettier, gitleaks, Vercel (ADR-0001, ADR-0002, AUTH-001 TD log).

## How to classify state

Inspect in order:

1. GitHub Issue (approvals, DoR, plan approval) — **gate record only**
2. Artifacts on git: AUTH-001 legacy paths **or** `docs/features/<ID>/`
3. Decision log status (High risk)
4. Implementation plan exists **and** human-approved → else not `PLANNED`
5. Branch type and whether `src/` diffs exist (if they exist before
   `PLANNED`, stop and do not add more code)
6. `docs/test-reports/` evidence
7. Whether `main` contains the feature; smoke evidence; artifact Status
8. Bugs, PR target (`test` vs `main`), CI

Earliest incomplete state wins. Names are **only** those in
`docs/sdlc/lifecycle.md`. Merged to `main` without smoke PASSED is
`ON_MAIN`, never `RELEASED`.

If Issue and `main` files disagree, **`main` files win**.

## Risk

Classify using `docs/sdlc/risk-model.md` before choosing artifact
depth. AUTH-001 and CRM-001 are **High**.

High requires a **decision log** and security notes in TS/test plan.

## State → action

| State               | Next                                                                                                                                                                | Agent must not                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `REQUESTED`         | `analyze-requirements` then `author-specifications` until the risk-class pack exists                                                                                | Invent scope                                                              |
| `SPECIFIED`         | In order: stories/AC → `author-bdd` → `plan-tests` (ISTQB P/N/E from AC; BLOCKED if no oracle) + matrix → TS; High: `author-decisions`. Then **STOP** for human DoR | Invent extra tests as product rules; implement; enter `READY` yourself    |
| `READY`             | `plan-implementation` into `docs/features/<ID>/implementation-plan.md`; **STOP**                                                                                    | `feature/` or `src/`                                                      |
| `PLANNED`           | Implement **only** the approved plan on `feature/<id>-…`. Optional: `ui-ux-redesign` for **proposals** on existing screens only                                     | Expand product scope; implement restyle before PO picks from the proposal |
| `IN_DEVELOPMENT`    | Continue plan; add automated tests as specified. `ui-ux-redesign` may update the CRM-001 proposal; do not ship CSS until PO selects items                           | Claim TESTING without execution                                           |
| `TESTING`           | `execute-tests`                                                                                                                                                     | Silent heal; fake PASSED                                                  |
| `HEALING`           | `heal` then return to `TESTING`. If GitHub CI failed on this branch, start `heal` from the Actions log without waiting for the human to name the job                | Weaken tests; record heal as PASSED                                       |
| `REGRESSION`        | Planned pack only                                                                                                                                                   | Skip High regression without human                                        |
| `READY_FOR_PR`      | `report-tests`, agent `review-code`, `prepare-pr` to `test`                                                                                                         | Merge `main`; treat this as human QA                                      |
| `IN_QA`             | Wait; if CI fails on the feature branch, `heal` from the job log (timeout vs assertion vs format)                                                                   | Self-approve QA gate                                                      |
| `READY_FOR_RELEASE` | `sync-feature-docs` at `ON_MAIN`; `release-and-verify` prepare only                                                                                                 | Merge `main`; claim `RELEASED`                                            |
| `ON_MAIN`           | Confirm deploy state; run or record production smoke. If smoke PASSED: `sync-feature-docs` at `RELEASED` (PR to `main`)                                             | Claim `RELEASED` or Done; delete release branch before `test` sync        |
| `RELEASED`          | Confirm DoD; sync release branch → `test` if still needed; then delete release branch. **STOP** for human Issue close                                               | Close Issue; production data without human                                |

`author-adr` only for durable **platform** choices, not Client columns.
`manage-bugs` after defects.

If the user says “just implement”, refuse and name the blocking gate
from `docs/sdlc/lifecycle.md`.

Never auto-transition `ON_MAIN` → `RELEASED` because a release PR
merged. Invoke `sync-feature-docs` before that merge (`ON_MAIN` docs)
and again only after smoke **PASSED** (`RELEASED` docs). Stop whenever
a human decision is required. Do not self-approve human gates.

## Instruction “Start `<ID>`”

1. Identify work item (do not mint IDs for unstated products; CRM-001
   and AUTH-001 already exist).
2. Read Issue, roadmap, ADRs, this skill. Reuse AUTH-001 authorization
   (ADMIN write / VIEWER read) where the feature says so.
3. List existing vs missing artifacts for the **risk class**.
4. List approved BD/TD vs `TBD — HUMAN DECISION REQUIRED`.
5. Do **only** work allowed in the current state.
6. Feature-specific start notes live under `docs/sdlc/` or
   `docs/features/<ID>/` (example: `docs/sdlc/start-crm-001.md`). Do
   not grow this skill with a paragraph per feature.
7. Run `docs/sdlc/validation-rules.md`.
8. Output: ID, state, evidence, next skill or wait-for-human,
   blockers, what you will **not** do.

For **CRM-001** while state is `SPECIFIED`: do not create `src/` Client
modules, feature branches, or migrations. Stop for human DoR.

## Human gates

Follow **only** `docs/sdlc/lifecycle.md` (Human gates) and
`docs/sdlc/human-approval.md`. Do not keep a second numbered list here.
