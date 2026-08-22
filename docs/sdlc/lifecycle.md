# Feature lifecycle (canonical)

This is the **only** canonical BankCRM delivery process. Cursor skills
implement it. Other docs must point here; they must not define a
competing sequence.

Start every feature with
`.cursor/skills/feature-orchestrator/SKILL.md`.

## Conceptual flow

REQUESTED → REQUIREMENTS → Functional Specification → User Stories /
Acceptance Criteria → BDD → Test design → Traceability → Technical
Specification → Security/technical review (when risk requires) →
**Definition of Ready (human)** → `READY` → Implementation Plan →
**Human plan approval** → `PLANNED` → Feature Branch → Implementation
→ Test execution → Code review → QA/acceptance → Merge/release →
Verification → Done (Definition of Done)

## State names (do not rename)

These names are stable. Activities above map onto them; they are not
extra states.

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
| `REGRESSION`        | Risk-based regression executing                                             | Report + review → `READY_FOR_PR`                                 |
| `READY_FOR_PR`      | Evidence and review complete                                                | PR targeting `test`                                              |
| `IN_QA`             | PR open on `test`; CI/QA                                                    | **Human QA** → `READY_FOR_RELEASE`                               |
| `READY_FOR_RELEASE` | QA approved                                                                 | Release PR; **human merge to `main`** → `RELEASED`               |
| `RELEASED`          | On `main`; smoke/verification                                               | DoD                                                              |

Current state is the **earliest incomplete** state. Do not fast-forward.

`READY` is necessary but not sufficient for implementation.
`PLANNED` permits implementation.

## Post-implementation workflow

After `PLANNED` and code on `feature/<id>-…` targeting `test`:

Implementation → unit/integration (Vitest) → e2e (Playwright) →
lint / format / gitleaks → evidence in `docs/test-reports/` → PR to
`test` → human code review → QA/acceptance → merge to `test` →
release PR → **human merge to `main`** → deployment (existing Vercel
intent) → smoke/verification → Definition of Done.

Do not invent new infrastructure. Use GitHub Actions and environments
already described in `docs/architecture/environments.md`.

## Human gates (cannot be skipped)

1. Product/business decisions and TBDs (any time; agent must not invent)
2. `SPECIFIED` → `READY`: Definition of Ready on the Issue
3. `READY` → `PLANNED`: implementation plan approval
4. `IN_QA` → `READY_FOR_RELEASE`: CI/QA approval
5. `READY_FOR_RELEASE` → `RELEASED`: human merge to `main`
6. Production data and security exceptions: explicit human authorization

Silence is not approval.

## Roles

| Actor              | May                                                                                         | Must not                                                |
| ------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Human PO/BA        | Objective, scope, BD answers, REQ acceptance, DoR, plan approval, final acceptance, release | Leave TBDs for the agent to guess                       |
| Agent as BA        | Draft REQ, FS, US, AC, questions, functional traceability                                   | Invent rules, roles, workflows, errors                  |
| Agent as QA        | Draft BDD, TC, test plan, risk, designed tests                                              | Claim PASSED without execution                          |
| Agent as architect | Draft TS, TDE, technical questions, proposed TD; reuse ADRs                                 | Replace ADR-0001/0002; add frameworks; apply migrations |
| Agent as developer | Plan after Ready; code only in `PLANNED`; tests; evidence; PR to `test`                     | Expand scope; `feature/` before `PLANNED`; merge `main` |
| CI                 | Format, secrets, commitlint; lint/unit/e2e when `src/` exists                               | Be treated as PASSED when SKIPPED                       |

## Product roadmap

See [roadmap.md](roadmap.md). Order: AUTH-001 → CRM-001 → DASH-001.

## Related

- [artifacts.md](artifacts.md) — what each document is for
- [risk-model.md](risk-model.md) — Low / Medium / High
- [change-control.md](change-control.md)
- [definition-of-ready.md](definition-of-ready.md)
- [definition-of-done.md](definition-of-done.md)
- [../features/README.md](../features/README.md)
- [validation-rules.md](validation-rules.md)
- [start-crm-001.md](start-crm-001.md)
- [repository-audit.md](repository-audit.md)
