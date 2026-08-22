# Human approval

The agent must not treat silence as approval. Approval is a recorded
human statement on the Issue, PR, or explicit chat instruction for
that gate.

## Gates

| From                             | To                     | Who   | What                                                     |
| -------------------------------- | ---------------------- | ----- | -------------------------------------------------------- |
| Business TBD / High decision log | (stay SPECIFIED)       | Human | Accept, reject, or change BD/TD                          |
| `SPECIFIED`                      | `READY`                | Human | Definition of Ready — plan may be written; no code       |
| `READY`                          | `PLANNED`              | Human | Implementation plan — then `feature/` and `src/` allowed |
| `IN_QA`                          | `READY_FOR_RELEASE`    | Human | CI/QA on `test`                                          |
| `READY_FOR_RELEASE`              | `RELEASED`             | Human | Merge `test` → `main`                                    |
| any                              | production data change | Human | Explicit authorization                                   |
| any                              | security exception     | Human | Explicit authorization                                   |

The `feature-orchestrator` skill must stop at these gates.

Merging to `main`, deploying production, and changing production data
are **never** agent actions.
