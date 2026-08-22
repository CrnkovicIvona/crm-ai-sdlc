# Feature lifecycle (canonical)

This is the **only** canonical BankCRM delivery process. Cursor skills
implement it. Other docs must point here; they must not define a
competing sequence. Do not duplicate the Human gates list in skills
or rules — link here (and the table in
[human-approval.md](human-approval.md)).

Start every feature with
`.cursor/skills/feature-orchestrator/SKILL.md`.

## Conceptual flow

REQUESTED → REQUIREMENTS → Functional Specification → User Stories /
Acceptance Criteria → BDD → Test design → Traceability → Technical
Specification → Security/technical review (when risk requires) →
**Definition of Ready (human)** → `READY` → Implementation Plan →
**Human plan approval** → `PLANNED` → Feature Branch → Implementation
→ Test execution → agent `review-code` → PR to `test` → QA/acceptance
(human reads the PR diff) → Merge/release → Verification → Definition
of Done

## State names (do not rename)

These names are stable. Activities in the conceptual flow **map onto**
them; they are not extra states. Do not add names such as “After AC”
or `DONE`.

| State               | Meaning                                                                     | Exit                                                             |
| ------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `REQUESTED`         | Issue or human business request exists                                      | REQ drafting starts                                              |
| `REQUIREMENTS`      | REQ and functional spec in progress                                         | REQ + FS exist; unknowns listed                                  |
| `SPECIFIED`         | Required artifacts for the **risk class** exist; TS exists for app features | **Human DoR** → `READY`                                          |
| `READY`             | Human recorded Definition of Ready. **Not permission to code.**             | Implementation plan drafted; **human plan approval** → `PLANNED` |
| `PLANNED`           | Implementation plan approved. `feature/` and `src/` may start               | Implementation begins                                            |
| `IN_DEVELOPMENT`    | Application or test automation in progress                                  | Planned tests start executing                                    |
| `TESTING`           | Planned tests executing                                                     | Failures → `HEALING`; success → `REGRESSION` as planned          |
| `HEALING`           | Failures being remediated                                                   | Return to `TESTING`                                              |
| `REGRESSION`        | Risk-based regression executing                                             | Report + agent `review-code` → `READY_FOR_PR`                    |
| `READY_FOR_PR`      | Evidence recorded; agent `review-code` done                                 | PR targeting `test`                                              |
| `IN_QA`             | PR open on `test`; CI; human reads the diff                                 | **Human QA** → `READY_FOR_RELEASE`                               |
| `READY_FOR_RELEASE` | QA approved                                                                 | Release PR; **human merge to `main`** → `RELEASED`               |
| `RELEASED`          | On `main`; smoke/verification                                               | [DoD](definition-of-done.md) checklist; no extra state           |

Current state is the **earliest incomplete** state. Do not fast-forward.

`READY` is necessary but not sufficient for implementation.
`PLANNED` permits implementation.

### How conceptual activities map to states

| State            | Activities (not extra states)                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `REQUESTED`      | Issue or recorded business request                                                                                                                                                   |
| `REQUIREMENTS`   | REQ + functional spec (WHAT). Unknowns listed. Stories do not start here.                                                                                                            |
| `SPECIFIED`      | In order: user stories + AC → BDD (risk class) → test cases + test plan → traceability → technical spec. High: decision log (BD/TD) and security notes. Then **stop** for human DoR. |
| `READY`          | Implementation plan only (no `src/`)                                                                                                                                                 |
| `PLANNED` onward | Code, tests, evidence, PR, QA, release as in the state table                                                                                                                         |

## Post-implementation workflow

After `PLANNED` and code on `feature/<id>-…` targeting `test`:

Implementation → unit/integration (Vitest) → e2e (Playwright) →
lint / format / gitleaks → evidence in `docs/test-reports/` → agent
`review-code` → PR to `test` → **human** QA on that PR (includes
reading the diff; CODEOWNERS) → merge to `test` → release PR →
**human merge to `main`** → deployment (existing Vercel intent) →
smoke/verification → [Definition of Done](definition-of-done.md).

Agent `review-code` (before the PR) is not human approval. Human
review of the diff is **part of** the `IN_QA` → `READY_FOR_RELEASE`
gate. It is not a separate state and not a separate numbered gate.

There is no `DONE` state. After `RELEASED`, do not claim the work
finished until the DoD checklist is met (smoke executed or
**human-deferred**). Merge to `main` remains gate 5.

Do not invent new infrastructure. Use GitHub Actions and environments
already described in [../architecture/environments.md](../architecture/environments.md).

## Human gates (cannot be skipped)

This is the **only** numbered list. Skills and `.cursor/rules/` must
link here, not copy a shorter or longer list.

1. Product/business TBDs and High-risk decision-log items (BD/TD); agent must not invent
2. `SPECIFIED` → `READY`: Definition of Ready on the Issue
3. `READY` → `PLANNED`: implementation plan approval
4. `IN_QA` → `READY_FOR_RELEASE`: CI plus human QA on `test` (human reads the PR diff)
5. `READY_FOR_RELEASE` → `RELEASED`: human merge to `main`
6. Production data and security exceptions: explicit human authorization
7. Secrets, seed users, and non-prod project config (GitHub/Vercel env, Supabase URL and anon key). Silence is not “secrets are unset, skip is OK”

High regression packs cannot be skipped without a human (see
[definition-of-done.md](definition-of-done.md) and the feature test
plan). That is a rule inside `REGRESSION`, not an eighth numbered gate
on every Low docs change.

Silence is not approval. See [human-approval.md](human-approval.md).

## Roles

| Actor                     | May                                                                                         | Must not                                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Human PO/BA               | Objective, scope, BD answers, REQ acceptance, DoR, plan approval, final acceptance, release | Leave TBDs for the agent to guess                                                                                                               |
| Agent as BA               | Draft REQ, FS, US, AC, questions, functional traceability                                   | Invent rules, roles, workflows, errors                                                                                                          |
| Agent as QA               | Draft BDD, TC, test plan, risk, designed tests                                              | Claim PASSED without execution                                                                                                                  |
| Agent as architect        | Draft TS, TDE, technical questions, proposed TD; reuse ADRs                                 | Replace [ADR-0001](../adr/0001-engineering-foundation.md) or [ADR-0002](../adr/0002-vite-react-typescript.md); add frameworks; apply migrations |
| Agent as developer        | Plan after Ready; code only in `PLANNED`; tests; evidence; PR to `test`                     | Expand scope; `feature/` before `PLANNED`; merge `main`                                                                                         |
| CI                        | Format, secrets, commitlint; lint/unit/e2e when `src/` exists                               | —                                                                                                                                               |
| Agent or human reading CI | —                                                                                           | Treat a SKIPPED or NOT APPLICABLE job as PASSED                                                                                                 |

## Product roadmap

See [roadmap.md](roadmap.md). Order: AUTH-001 → CRM-001 → DASH-001.

## Related

- [artifacts.md](artifacts.md) — what each document is for; BD / TD / TDE
- [risk-model.md](risk-model.md) — Low / Medium / High
- [change-control.md](change-control.md)
- [definition-of-ready.md](definition-of-ready.md)
- [definition-of-done.md](definition-of-done.md)
- [../adr/0001-engineering-foundation.md](../adr/0001-engineering-foundation.md)
- [../adr/0002-vite-react-typescript.md](../adr/0002-vite-react-typescript.md)
- [../features/README.md](../features/README.md)
- [validation-rules.md](validation-rules.md)
- [start-crm-001.md](start-crm-001.md)
- [repository-audit.md](repository-audit.md)
