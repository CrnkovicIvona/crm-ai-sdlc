# Validation rules (agent self-check)

Run these before claiming a phase is complete. Canonical process:
[lifecycle.md](lifecycle.md).

## Always

1. Current state is the earliest incomplete state in the orchestrator
   table. Do not skip.
2. Every unknown is `TBD — HUMAN DECISION REQUIRED` or an approved
   BD/TD ID. No silent answers.
3. FS = WHAT. TS = HOW. ADR = platform WHY. Plan = exact files after
   Ready. Decision log ≠ ADR.
4. No `src/`, `feature/`, migrations, RLS SQL, APIs, or deploy unless
   state is `PLANNED` and the change is in the approved plan.
5. `READY` is only set by a recorded human DoR. Agent never self-Ready.
6. Tests: DESIGNED ≠ EXECUTED ≠ PASSED. SKIPPED / NOT APPLICABLE ≠
   PASSED.
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
