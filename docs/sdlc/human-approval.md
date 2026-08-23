# Human approval

The agent must not treat silence as approval. Approval is a recorded
human statement on the Issue, PR, or explicit chat instruction for
that gate.

Canonical numbered list: [lifecycle.md](lifecycle.md) (Human gates).
This table is the same set, not a competing sequence.

| From                             | To                     | Who   | Kind                         | What                                                          |
| -------------------------------- | ---------------------- | ----- | ---------------------------- | ------------------------------------------------------------- |
| Business TBD / High decision log | (stay SPECIFIED)       | Human | Decision                     | Accept, reject, or change BD/TD                               |
| `SPECIFIED`                      | `READY`                | Human | Decision                     | Definition of Ready — plan may be written; no code            |
| `READY`                          | `PLANNED`              | Human | Decision                     | Implementation plan — then `feature/` and `src/` allowed      |
| `IN_QA`                          | `READY_FOR_RELEASE`    | Human | Decision                     | CI plus QA on `test`, including reading the PR diff           |
| `READY_FOR_RELEASE`              | `ON_MAIN`              | Human | Decision + execution         | Merge **release PR** → `main` (not `feature/*` → `main`)      |
| `ON_MAIN`                        | `RELEASED`             | Human | Merge of docs PR if required | Only after smoke **PASSED** and `sync-feature-docs` on `main` |
| `ON_MAIN`                        | (stay `ON_MAIN`)       | Human | Smoke exception              | Recorded skip/exception is **not** PASSED; never `RELEASED`   |
| Issue close                      | —                      | Human | Decision + execution         | Only if `main` says `RELEASED` and DoD is met                 |
| any                              | production data change | Human | Decision                     | Explicit authorization                                        |
| any                              | security exception     | Human | Decision                     | Explicit authorization                                        |
| any                              | secrets / seed / env   | Human | Decision                     | GitHub/Vercel/Supabase URL and anon key; skip ≠ passed        |

The `feature-orchestrator` skill must **stop** at these gates and must
**not** maintain a second list.

## Decision vs mechanical execution

| Action                                       | Human decision? | Human execution?            | Agent / Actions                        |
| -------------------------------------------- | --------------- | --------------------------- | -------------------------------------- |
| DoR, plan, QA, release approval              | Yes             | Record on Issue             | Prepare only                           |
| Merge release PR to `main`                   | Yes             | Yes (GitHub merge)          | Never                                  |
| Merge follow-up `RELEASED` docs PR to `main` | No (product)    | Yes (PR required on `main`) | Agent opens PR                         |
| Release branch → `test`                      | No              | Only if push is rejected    | Actions primary; agent fallback        |
| Delete release branch after successful sync  | No              | No                          | Actions / agent                        |
| Close Issue                                  | Yes             | Yes                         | Must not close unless `RELEASED` + DoD |

Merging to `main`, deploying production, and changing production data
are **never** agent actions.

Release → `test` sync is **not** a product-approval gate. If GitHub
rejects a push to `test`, a PR is a **protection** fallback, not a
second QA.
