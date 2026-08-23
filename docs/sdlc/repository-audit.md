# Repository audit (process standardization)

Date: 2026-08-22  
**Historical snapshot.** Do not treat product rows as current
lifecycle. AUTH-001 is **`RELEASED`** after the REL-003 close-out is
on `main` (see [roadmap.md](roadmap.md)). CRM-001 remains `SPECIFIED`.

Scope: after encoding canonical SDLC, CRM-001 specs, AUTH-001
fail-closed. No implementation.

Class: **P0** blocks safe process/security · **P1** important gap ·
**P2** improvement · **P3** cosmetic.

## Process

| ID    | Finding                                                          | Where                                          | Why                                          | Change                                        | Blocks DoR?                               | Human?  |
| ----- | ---------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------- | --------------------------------------------- | ----------------------------------------- | ------- |
| P1-01 | CRM-001 has no GitHub Issue number                               | GitHub; `docs/features/CRM-001/issue-draft.md` | Orchestrator prefers Issue as request source | Human opens Issue from draft                  | No for spec; yes for formal DoR recording | **Yes** |
| P2-01 | AUTH-001 remains on legacy paths                                 | `docs/requirements/` etc.                      | Dual layout                                  | Keep; documented in `docs/features/README.md` | No                                        | No      |
| P2-02 | Conceptual vs state names still need both tables                 | `docs/sdlc/lifecycle.md`                       | Agents might confuse READY_FOR_PR vs READY   | Lifecycle already maps them                   | No                                        | No      |
| P3-01 | Some READMEs still mention ENG-001 as “current phase” in passing | e.g. older test reports                        | Stale tone                                   | Left ENG-001 reports as historical            | No                                        | No      |

Lifecycle, orchestrator, state semantics (`READY` ≠ code, `PLANNED` =
code), human gates, skills, templates, and
[validation-rules.md](validation-rules.md) are in the repository.

## Product

| ID    | Finding                                       | Where                    | Why                                   | Change                                       | Blocks DoR?             | Human?           |
| ----- | --------------------------------------------- | ------------------------ | ------------------------------------- | -------------------------------------------- | ----------------------- | ---------------- |
| —     | AUTH-001 was SPECIFIED **at audit date**      | Issue #5, REQ-001        | DoR not yet recorded on 2026-08-22    | Superseded: AUTH-001 later reached `ON_MAIN` | Was Ready (then)        | Historical       |
| —     | CRM-001 SPECIFIED not implemented             | `docs/features/CRM-001/` | Intentional                           | —                                            | CRM-001 Ready           | **Yes** to Ready |
| P1-02 | Many CRM-001 TBDs                             | `decisions.md` BD-T\*    | Planning may invent validation/search | Human answers or accepts non-blocking        | **Yes** unless accepted | **Yes**          |
| P2-03 | DASH-001 unspecified                          | roadmap                  | Intentional                           | Do not specify now                           | N/A                     | No               |
| P2-04 | ADMIN search UX TBD vs VIEWER SEARCH approved | FS-CRM-001               | Could confuse agents                  | FS states ADMIN READ approved; search UX TBD | No if agent follows FS  | No               |

Approved AUTH-001 BD-001–BD-008 / TD-001–TD-008 were not reopened.
ADR-0002 was not reopened.

## Architecture

| ID    | Finding                 | Where              | Why                       | Change                  | Blocks DoR?                           | Human?  |
| ----- | ----------------------- | ------------------ | ------------------------- | ----------------------- | ------------------------------------- | ------- |
| P2-05 | Supabase not configured | environments, TS   | Runtime later             | Do not configure now    | No for spec                           | Later   |
| P2-06 | Audit HOW TBD           | TD-C006            | High-risk mechanism unset | Human before or at plan | May block Ready if human requires HOW | **Yes** |
| —     | No stack conflict       | ADR-0002 vs CRM TS | Reuse                     | —                       | No                                    | No      |

## QA

| ID    | Finding                                               | Where           | Why                        | Change                                    | Blocks DoR?                  | Human?  |
| ----- | ----------------------------------------------------- | --------------- | -------------------------- | ----------------------------------------- | ---------------------------- | ------- |
| —     | CRM-001 tests DESIGNED                                | test-cases/plan | Correct                    | —                                         | No                           | No      |
| P2-07 | SEARCH tests cannot assert matching                   | TC-C008         | BD-T006 open               | Human                                     | If search AC must be precise | **Yes** |
| P3-02 | AUTH-001 TDE-008 is test architecture not fail-closed | AUTH TS         | Naming overlap with TD-008 | Fail-closed mapped to TDE-001; documented | No                           | No      |

Execution semantics: DESIGNED / NOT EXECUTED / PASSED distinct in
artifacts.md, execute-tests, DoD.

## Security

| ID    | Finding                                   | Where                           | Why                                        | Change                        | Blocks DoR?                      | Human?          |
| ----- | ----------------------------------------- | ------------------------------- | ------------------------------------------ | ----------------------------- | -------------------------------- | --------------- |
| —     | Fail-closed specified                     | AUTH-001 BD-008, FR-013, AC-012 | Was the documented gap                     | Recorded; unit `decideAccess` | AUTH-001 still not Ready (human) | **Yes** Ready   |
| —     | RLS intent without SQL                    | CRM TS / AUTH TS                | Correct for this phase                     | Implement only PLANNED        | No                               | No              |
| P1-03 | Audit insert privilege vs VIEWER spoofing | CRM TS open Q6                  | Could allow fake audit or block real audit | Human with TD-C006            | Possibly                         | **Yes**         |
| P2-08 | No field-level security on OIB for VIEWER | Approved BD-C005                | Privacy tradeoff is explicit               | Do not invent FLS             | No                               | Already decided |
| P2-09 | DELETE confirmation TBD                   | BD-T010                         | Destructive UX                             | Human                         | Possibly                         | **Yes**         |

Could an agent implement a protected feature while bypassing
Auth/RLS/fail-closed/audit? **Not if it follows orchestrator +
guardrails + PLANNED-only coding.** Remaining risk is ignoring
skills; rules are alwaysApply.

## Consistency

| ID    | Finding                               | Where           | Why                      | Change                         | Blocks DoR? | Human?  |
| ----- | ------------------------------------- | --------------- | ------------------------ | ------------------------------ | ----------- | ------- |
| P1-04 | No CRM-001 Issue                      | GitHub          | Trace Issue column empty | Human opens                    | Formal DoR  | **Yes** |
| P2-10 | AUTH-001 not migrated                 | features README | Avoid broken refs        | Documented recommendation only | No          | No      |
| P3-03 | README still has two intro paragraphs | `README.md`     | Redundant                | Optional later                 | No          | No      |

No P0 remaining after this change set: competing “framework deferred”
README, missing orchestrator, and missing CRM pack were the main
process holes.

## Orphans

- ENG-001 / REL-\* remain historical; not CRM-001.
- No `src/` (correct).
- No CRM-001 implementation-plan (correct: not Ready).

## Instructions that could bypass gates

Mitigated: `git-workflow.mdc` and `branching.md` now say `feature/`
only after `PLANNED`. Orchestrator forbids `src/` until `PLANNED`.
Agent must still refuse “just implement”.
