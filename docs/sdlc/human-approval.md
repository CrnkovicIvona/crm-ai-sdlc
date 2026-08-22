# Human approval

The agent must not treat silence as approval. Approval is a recorded
human statement on the Issue, PR, or explicit chat instruction for
that gate.

## Gates

Canonical numbered list: [lifecycle.md](lifecycle.md) (Human gates).
This table is the same set, not a competing sequence.

| From                             | To                     | Who   | What                                                     |
| -------------------------------- | ---------------------- | ----- | -------------------------------------------------------- |
| Business TBD / High decision log | (stay SPECIFIED)       | Human | Accept, reject, or change BD/TD                          |
| `SPECIFIED`                      | `READY`                | Human | Definition of Ready — plan may be written; no code       |
| `READY`                          | `PLANNED`              | Human | Implementation plan — then `feature/` and `src/` allowed |
| `IN_QA`                          | `READY_FOR_RELEASE`    | Human | CI plus QA on `test`, including reading the PR diff      |
| `READY_FOR_RELEASE`              | `RELEASED`             | Human | Merge `test` → `main`                                    |
| any                              | production data change | Human | Explicit authorization                                   |
| any                              | security exception     | Human | Explicit authorization                                   |
| any                              | secrets / seed / env   | Human | GitHub/Vercel/Supabase URL and anon key; skip ≠ passed   |

The `feature-orchestrator` skill must **stop** at these gates and must
**not** maintain a second list.

Merging to `main`, deploying production, and changing production data
are **never** agent actions.
