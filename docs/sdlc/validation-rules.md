# Validation rules (agent self-check)

Run these before claiming a phase is complete. Canonical process:
[lifecycle.md](lifecycle.md).

## Always

1. Current state is the earliest incomplete state in
   [lifecycle.md](lifecycle.md). Do not skip. Do not invent state names
   (`VERIFICATION_PENDING`, `DONE`, etc.).
2. Every unknown is `TBD — HUMAN DECISION REQUIRED` or an approved
   BD/TD ID. No silent answers.
3. FS = WHAT. TS = HOW. ADR = platform WHY. Plan = exact files after
   Ready. Decision log ≠ ADR.
4. No `src/`, `feature/`, migrations, RLS SQL, APIs, or deploy unless
   state is `PLANNED` and the change is in the approved plan.
5. `READY` is only set by a recorded human DoR. Agent never self-Ready.
6. Tests: DESIGNED ≠ EXECUTED ≠ PASSED. SKIPPED / NOT APPLICABLE /
   HEALING ≠ PASSED.
7. Impact analysis when changing an approved statement
   ([change-control.md](change-control.md)).
8. Reuse ADR-0002, React Router, Supabase, AUTH-001 roles. Do not add
   forbidden tooling (Jira, Notion-as-truth, Next.js, GraphQL, Redux,
   microservices, extra REST).

## High risk extra

9. Decision log exists. Proposed ≠ approved.
10. Security implications in TS and test plan (authn, authz, RLS,
    fail-closed, PII, DELETE, audit if in FS).
11. Traceability complete for FRs (implementation column empty until
    code).

## “Start `<ID>`” extra

12. Inspect Issue (or issue-draft), roadmap, existing artifacts, AUTH-001
    if CRM.
13. List missing artifacts for the risk class.
14. Do only the next permitted skill.
15. Stop and name the human gate when TBDs block DoR or when Ready/plan
    is required.

## Evidence grades (never collapse)

Use only these four grades for release and close-out checks. Do not
invent a fifth success grade. Do not map other words onto PASS.

| Grade              | Meaning                                                | Treat as PASS? |
| ------------------ | ------------------------------------------------------ | -------------- |
| **PASS**           | Condition verified with evidence                       | Yes            |
| **FAIL**           | Condition was checked and failed                       | No             |
| **MISSING**        | No evidence, not executed, unknown, or unrecorded      | No             |
| **NOT APPLICABLE** | Out of scope for this change class (must be justified) | No             |

SKIPPED is recorded as **MISSING** or **NOT APPLICABLE** as appropriate;
it is never PASS. HEALING is never PASS. A closed GitHub Issue is not
PASS for `RELEASED`.

## RELEASED / Done extra (mandatory)

16. Merged to `main` without smoke PASSED is `ON_MAIN`, never `RELEASED`.
17. Refuse to claim `RELEASED` or Done if **any** of the following is true:
    - specifications or feature README still `IN_QA` (or earlier) while
      code is on `main`
    - roadmap or root README stale vs `main`
    - traceability matrix missing implementation paths, test execution,
      or verification
    - release document missing
    - implementation paths in the matrix do not exist on the release SHA
    - test report missing or only SKIPPED presented as PASSED
    - no CI evidence for the release SHA
    - deployment state unknown (no URL and no recorded “not configured”)
    - production smoke missing, skipped, markdown-only, or not PASSED
      (`tests/smoke/` must have been executed against Production)
18. If 16–17 fail, the required sentence is:

    **ON_MAIN — not RELEASED.**

    Never reinterpret missing evidence as success.

19. Do not close a GitHub Issue unless `main` artifact status is
    `RELEASED` and [definition-of-done.md](definition-of-done.md) is met.
    The Issue is a gate record; git is the implementation source of truth.
    A closed Issue does **not** make the feature `RELEASED`.
20. Labels are not a lifecycle. Ignore feature/chore labels when
    classifying state.
