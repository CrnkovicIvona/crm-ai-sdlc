# Artifact model

Each artifact has one job. Do not copy the same content into every
file. Link instead.

New application features live under `docs/features/<ID>/` (see
[../features/README.md](../features/README.md)). AUTH-001 keeps its
existing paths.

## Abbreviations

| Term      | Meaning                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| BD        | Business decision in the feature **decision log** (human-approved). Not an ADR.                                                  |
| TD        | Technical decision in that same log (how, still feature-scoped). Not an ADR. Promote to ADR only if the choice is platform-wide. |
| TDE       | Technical design element: a row in the technical spec that traces HOW to an FR.                                                  |
| ADR       | Architecture decision record under `docs/adr/` (durable platform **WHY**).                                                       |
| DoR / DoD | Definition of Ready / Definition of Done                                                                                         |

## Artifacts

| Artifact            | Answers                                   | Owner (draft / approve)        | Stage                | Mandatory                                         |
| ------------------- | ----------------------------------------- | ------------------------------ | -------------------- | ------------------------------------------------- |
| REQ                 | What the business asked                   | Agent BA / human               | REQUESTED–SPECIFIED  | Always                                            |
| Functional spec     | **WHAT** the system must do               | Agent BA / human DoR           | SPECIFIED            | Always for product features                       |
| User stories        | Delivery slices                           | Agent BA / human               | SPECIFIED (after FS) | Always except Low docs/chore                      |
| AC                  | Testable conditions                       | Agent BA+QA / human            | with stories         | Always except Low docs/chore                      |
| BDD                 | Gherkin of AC                             | Agent QA / human via DoR       | after AC             | Medium+; High always                              |
| Test cases          | How to verify AC                          | Agent QA                       | after BDD            | Always for app features                           |
| Test plan           | Risk, in/out, regression, environments    | Agent QA                       | with TCs             | Always for app features                           |
| Traceability        | REQ→…→verification                        | Agent                          | before TS complete   | Always                                            |
| Technical spec      | **HOW** approved WHAT fits architecture   | Agent architect / human DoR    | after test design    | App features (lightweight if Low)                 |
| Decision log        | Feature BD/TD status                      | Agent draft / **human** accept | before DoR           | **High** (auth, PII, delete, money); optional Low |
| ADR                 | **WHY** a durable **platform** choice     | Agent via author-adr / human   | when needed          | Only platform-wide; not every column              |
| Implementation plan | **EXACTLY** which files/steps after Ready | Agent dev / **human** approve  | READY                | Always before code                                |
| DoR                 | Enough to plan without inventing          | Human                          | SPECIFIED→READY      | Always                                            |
| DoD                 | Enough to call the work finished          | Human + evidence               | after `RELEASED`     | Always                                            |
| Test report         | Execution evidence                        | Agent QA                       | TESTING–READY_FOR_PR | When tests were in scope                          |
| Release record      | REL notes, smoke, sync                    | Agent / human merge            | READY_FOR_RELEASE+   | Application releases                              |

## Forbidden mixing

- FS must not specify Vite, SQL, RLS policy text, or file paths.
- FS **may** require that authorization is enforced beyond the UI
  (database boundary) as a **rule**, without SQL.
- TS must not invent business rules. It reuses ADRs and approved BD.
- ADR is not a feature spec. Do not ADR Client columns.
- Implementation plan is not a spec. It names files, commands, seeds,
  and migration order **after** Ready.
- Decision log is not an ADR. Promote to ADR only when the choice is
  cross-feature (example: ADR-0002 Vite).

## Test result words

Use only: **DESIGNED**, **NOT EXECUTED**, **EXECUTED**, **PASSED**,
**FAILED**, **SKIPPED**, **NOT APPLICABLE**, **BLOCKED**, **VERIFIED**
(human accepted evidence). SKIPPED, NOT APPLICABLE, and BLOCKED are
never PASSED. BLOCKED = no approved expected result, or High
integration/e2e not executed for missing secrets (DoD incomplete).
