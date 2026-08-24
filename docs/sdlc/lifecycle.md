# Feature lifecycle (canonical)

This is the **only** canonical BankCRM delivery process. Cursor skills
implement it. Other docs must point here; they must not define a
competing sequence. Do not duplicate the Human gates list in skills
or rules — link here (and the table in
[human-approval.md](human-approval.md)).

Start every feature with
`.cursor/skills/feature-orchestrator/SKILL.md`.
UX/UI **proposals** for already-built screens (no new product scope):
`.cursor/skills/ui-ux-redesign/SKILL.md`.

## Conceptual flow

REQUESTED → SPECIFIED (REQ, FS, stories, AC, BDD, tests, traceability,
TS, security notes as required by risk) →
**Definition of Ready (human)** → `READY` → Implementation Plan →
**Human plan approval** → `PLANNED` → Feature Branch → Implementation
→ Test execution → agent `review-code` → PR to `test` → QA/acceptance
(human reads the PR diff) → release PR → **human merge to `main`** →
`ON_MAIN` → production smoke → **smoke PASSED** → documentation
close-out on `main` → `RELEASED` → release branch synced to `test` →
release branch deleted.

There is no `DONE` state. There is no `VERIFICATION_PENDING` or
`DEFERRED_VERIFICATION` state. Pending smoke is `ON_MAIN`.

## State names (do not rename)

| State               | Meaning                                                                                                                                      | Exit                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `REQUESTED`         | Issue or human business request exists                                                                                                       | Spec pack drafting starts                                               |
| `SPECIFIED`         | Required artifacts for the **risk class** exist; TS exists for app features. DoR not yet approved.                                           | **Human DoR** → `READY`                                                 |
| `READY`             | Human recorded Definition of Ready. Plan may be written. **Not permission to code.**                                                         | Implementation plan drafted; **human plan approval** → `PLANNED`        |
| `PLANNED`           | Implementation plan approved. `feature/` and `src/` may start                                                                                | Implementation begins                                                   |
| `IN_DEVELOPMENT`    | Application or developer tests in progress                                                                                                   | Planned tests start executing                                           |
| `TESTING`           | Planned automated tests executing                                                                                                            | Failures → `HEALING`; success → `REGRESSION` as planned                 |
| `HEALING`           | A failing test is being diagnosed or remediating. Healing is never recorded as PASSED.                                                       | Return to `TESTING`                                                     |
| `REGRESSION`        | Required regression suite executing                                                                                                          | Report + agent `review-code` → `READY_FOR_PR`                           |
| `READY_FOR_PR`      | Implementation, tests, evidence, and agent review complete                                                                                   | PR targeting `test`                                                     |
| `IN_QA`             | PR open on `test`; CI; human reads the diff                                                                                                  | **Human QA** → `READY_FOR_RELEASE`                                      |
| `READY_FOR_RELEASE` | Human QA passed. Release preparation may begin                                                                                               | Release PR prepared; **human merge to `main`** → `ON_MAIN`              |
| `ON_MAIN`           | Human merged the release to `main`. Code is on the production branch. Deploy may exist. **Production smoke has not PASSED.** Not `RELEASED`. | Smoke **PASSED** and docs/traceability close-out on `main` → `RELEASED` |
| `RELEASED`          | Strict conditions in [Release conditions](#released-strict-conditions) are all true                                                          | [DoD](definition-of-done.md); human may close the Issue                 |

Current state is the **earliest incomplete** state. Do not fast-forward.

`READY` is necessary but not sufficient for implementation.
`PLANNED` permits implementation.

Merged to `main` is **`ON_MAIN`**, never a synonym for `RELEASED`.

### RELEASED (strict conditions)

All of the following must be true. If any is missing, the state is
`ON_MAIN` (or earlier). The agent must say **“ON_MAIN — not RELEASED.”**
and must not claim `RELEASED` or Done.

1. Release was **human-merged** into `main`
2. Required documentation is synchronized **on `main`** (REQ, FS, US,
   TS, feature README, roadmap, release record). Root `README.md` stays
   a landing page (`.cursor/rules/readme.mdc`); it is not an increment
   status board.
3. Traceability is synchronized **on `main`**
4. CI evidence exists for the release SHA (SKIPPED ≠ PASSED)
5. Deployment state is **known** (production URL, or recorded
   “not configured”)
6. Production smoke has actually **PASSED** (commands executed; log or
   report). Not executed, skipped, or deferred is **not** PASSED

Do not invent test or smoke evidence.

### How conceptual activities map to states

| State            | Activities (not extra states)                                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUESTED`      | Issue or recorded business request. REQ/FS drafting may start here (not a separate state).                                                                                                      |
| `SPECIFIED`      | In order: REQ + FS → user stories + AC → BDD (risk class) → test cases + test plan → traceability → technical spec. High: decision log (BD/TD) and security notes. Then **stop** for human DoR. |
| `READY`          | Implementation plan only (no `src/`)                                                                                                                                                            |
| `PLANNED` onward | Code, tests, evidence, PR, QA, release, verification as in the state table                                                                                                                      |

## Post-implementation workflow

After `PLANNED` and code on `feature/<id>-…` (or allowed `cursor/`
alias) targeting `test`:

Implementation → unit/integration (Vitest) → e2e (Playwright) →
lint / format / gitleaks → evidence in `docs/test-reports/` → agent
`review-code` → PR to `test` → **human** QA (`IN_QA`) →
`READY_FOR_RELEASE` → `sync-feature-docs` (status `ON_MAIN`) in the
**release PR** → **human merge to `main`** → `ON_MAIN` → Vercel
Production (existing integration; agent does not deploy) →
executable production smoke (`tests/smoke/`, `npm run test:smoke`
or `.github/workflows/production-smoke.yml`) → if PASSED:
`sync-feature-docs` (status `RELEASED`) follow-up
PR to `main` → human merge → **then** release branch synced to `test`
→ **then** delete release branch → DoD → human may close Issue.

Agent `review-code` (before the PR) is not human approval. Human
review of the diff is **part of** the `IN_QA` → `READY_FOR_RELEASE`
gate.

There is no `DONE` state. After `RELEASED`, the Issue may close only
when the DoD checklist is met. Merge to `main` is gate 5 and yields
`ON_MAIN`, not `RELEASED`.

Documentation synchronization: `.cursor/skills/sync-feature-docs/SKILL.md`.
Release git: [../git/branching.md](../git/branching.md) and
[../git/release-sync.md](../git/release-sync.md).

## Human gates (cannot be skipped)

This is the **only** numbered list. Skills and `.cursor/rules/` must
link here, not copy a shorter or longer list.

1. Product/business TBDs and High-risk decision-log items (BD/TD); agent must not invent
2. `SPECIFIED` → `READY`: Definition of Ready on the Issue
3. `READY` → `PLANNED`: implementation plan approval
4. `IN_QA` → `READY_FOR_RELEASE`: CI plus human QA on `test` (human reads the PR diff)
5. `READY_FOR_RELEASE` → `ON_MAIN`: human merge of the **release PR** to `main`
6. Production data, security exceptions, and smoke exceptions: explicit human authorization. A recorded smoke skip is not PASSED; state stays `ON_MAIN`
7. Secrets, seed users, and non-prod project config (GitHub/Vercel env, Supabase URL and anon key). Silence is not “secrets are unset, skip is OK”
8. Issue close: human only, and only when `main` lifecycle is `RELEASED` and DoD is met

High regression packs cannot be skipped without a human (see
[definition-of-done.md](definition-of-done.md) and the feature test
plan). That is a rule inside `REGRESSION`, not an extra numbered gate
on every Low docs change.

Silence is not approval. See [human-approval.md](human-approval.md).

Human **decisions** are gates 1–4, 6–8, and the product meaning of
gate 5. Clicking merge on a **follow-up docs PR** to `main` after
smoke is GitHub’s required PR-to-`main` execution, not a new product
gate. Release → `test` sync and release-branch delete are
**mechanical** (GitHub Actions, agent fallback) — not product
approvals.

## Roles

| Actor                     | May                                                                                                | Must not                                                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Human PO/BA               | Objective, scope, BD answers, REQ acceptance, DoR, plan approval, QA, merge `main`, close Issue    | Leave TBDs for the agent to guess                                                                                                               |
| Agent as BA               | Draft REQ, FS, US, AC, questions, functional traceability                                          | Invent rules, roles, workflows, errors                                                                                                          |
| Agent as QA               | Draft BDD, TC, test plan, risk, designed tests                                                     | Claim PASSED without execution                                                                                                                  |
| Agent as architect        | Draft TS, TDE, technical questions, proposed TD; reuse ADRs                                        | Replace [ADR-0001](../adr/0001-engineering-foundation.md) or [ADR-0002](../adr/0002-vite-react-typescript.md); add frameworks; apply migrations |
| Agent as developer        | Plan after Ready; code only in `PLANNED`; tests; evidence; PR to `test`; sync docs                 | Expand scope; `feature/` before `PLANNED`; merge `main`; claim `RELEASED` without smoke PASSED                                                  |
| CI / GitHub Actions       | Format, secrets, commitlint; lint/unit/e2e when `src/` exists; release→`test` sync when configured | Treat SKIPPED as PASSED; deploy production                                                                                                      |
| Agent or human reading CI | —                                                                                                  | Treat a SKIPPED or NOT APPLICABLE job as PASSED                                                                                                 |

## Source of truth

- **Git (`main` for production claims)** is the source of truth for
  implementation and documented lifecycle status of artifacts.
- **GitHub Issue** is the **gate/audit record** (DoR, plan, QA, release
  approval, smoke notes). The Issue lifecycle field **mirrors** git;
  it is not an independent state machine. Do not use labels as a
  second lifecycle.
- If Issue text and `main` files disagree, **`main` files win**.

## Product roadmap

See [roadmap.md](roadmap.md). Order: AUTH-001 → CRM-001 → DASH-001.

## Related

- [artifacts.md](artifacts.md)
- [risk-model.md](risk-model.md)
- [change-control.md](change-control.md)
- [definition-of-ready.md](definition-of-ready.md)
- [definition-of-done.md](definition-of-done.md)
- [validation-rules.md](validation-rules.md)
- [../git/branching.md](../git/branching.md)
- [../git/release-sync.md](../git/release-sync.md)
- [start-crm-001.md](start-crm-001.md)
