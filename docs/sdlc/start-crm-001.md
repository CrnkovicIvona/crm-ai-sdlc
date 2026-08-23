# What happens on “Start CRM-001.”

This is the repeatable simulation of the canonical process. The
orchestrator (`.cursor/skills/feature-orchestrator/SKILL.md`) must
follow it without the human restating SDLC rules.

CRM-001 spec pack lives in `docs/features/CRM-001/`. It is **`READY`**
(PO chat 2026-08-23). It is **not `PLANNED`** and **not implemented**.

## REQUESTED → SPECIFIED (already done in-repo)

| Step | Agent reads                                                                      | Agent creates / updates                                                            | Stops if                                                      |
| ---- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1    | This file, lifecycle, risk-model, roadmap, AUTH-001 decisions/FS/TS (reuse only) | —                                                                                  | —                                                             |
| 2    | GitHub Issues for CRM-001                                                        | If none: use `docs/features/CRM-001/issue-draft.md`; do not invent an Issue number | Human may open the Issue later (non-blocking for spec drafts) |
| 3    | Approved Client/authz/audit decisions                                            | `requirement.md`                                                                   | Inventing extra entities/fields                               |
| 4    | REQ                                                                              | `functional-spec.md` WHAT only                                                     | Turning TBD into rules                                        |
| 5    | FS                                                                               | `user-stories.md` AC                                                               | Extra workflows                                               |
| 6    | AC                                                                               | `bdd.md` then `test-cases.md` `test-plan.md`                                       | Claiming EXECUTED                                             |
| 7    | Tests                                                                            | `traceability.md` + matrix                                                         | Broken chain                                                  |
| 8    | AUTH-001 architecture                                                            | `technical-spec.md` HOW; `decisions.md`                                            | New ADR for columns; SQL policies                             |
| 9    | DoR checklist                                                                    | Report gaps                                                                        | Marking Ready                                                 |

**Reuse from AUTH-001:** Vite/React/TS, React Router, Supabase Auth,
`profiles` ADMIN|VIEWER, fail-closed missing profile, UI+RLS, no
custom REST, session via Supabase. Do not copy AUTH-001 FS.

**Already approved for CRM-001:** Client-only; six fields; ADMIN CRUD;
VIEWER READ+SEARCH; all fields visible; RLS mandatory; audit successful
CUD with required attributes; UPDATE previous+new; append-only in app;
no READ audit; no failure audit.

**Gate 1 product defaults:** accepted 2026-08-23 (dor-gate-1 §5.1–§5.2).
See `decisions.md`.

CRM-001 is **`READY`**. Gate 2 plan:
[../features/CRM-001/implementation-plan.md](../features/CRM-001/implementation-plan.md)
(**Draft**). Do not implement until the plan is human-approved.

## After plan approval (not this PR)

```
Human approves implementation plan
  → PLANNED
  → cursor/crm-001-… (not before)

  → implement only the plan (Vite/React/Supabase/RLS/audit)
  → execute tests with evidence
  → PR to test
  → human review/QA
  → release/<rel-id> PR to main (human merge) → ON_MAIN
  → production smoke PASSED → docs close-out → RELEASED
  → sync release branch to test → delete release branch
  → Issue close only if DoD is met
```

`READY` is not coding. `PLANNED` is coding. Merged to `main` is not
`RELEASED` until production smoke PASSED.
