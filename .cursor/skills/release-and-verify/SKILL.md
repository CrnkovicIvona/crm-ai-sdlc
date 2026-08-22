---
name: release-and-verify
description: Prepare a release from test to main and describe post-deploy smoke. Never merge main or deploy production. Use at READY_FOR_RELEASE and RELEASED.
---

# Release and verify

## Rules

- Only after human QA approval (READY_FOR_RELEASE).
- Agent prepares the release branch and the release → main PR, and release notes.
- Agent does not merge to main. Only a human merges the release PR into main.
- **When this runs:** on the next **Agent** turn after the human says the
  PR is merged (or the agent can see `mergedAt` on the release PR). Ask
  mode cannot git-push. Silence after merge is not a skipped gate — the
  human may say “sync test”.
- Then merge the **same release branch** into `test` **without a second
  human PR** unless GitHub rejects the push (protected `test`). No force.
  Resolve doc conflicts that are only lifecycle labels to the released
  state. Other conflicts: stop, do not delete the branch, write them in
  `docs/releases/<rel-id>.md`.
- **Same SHA is not required** if the release was squashed for commitlint.
  Goal: `test` has the released tree plus notes; `main` stays the human
  merge. Do not reset `test` onto `main`.
- After both merges exist, delete the remote release branch. Never delete
  it before `test` has the sync.
- Post-deploy smoke must be actually executed against production with evidence.
  If not executed, status is "not executed".

## Steps

1. Confirm `docs/sdlc/production-readiness.md`.
2. Write `docs/releases/<rel-id>.md`.
3. Open release PR `release/<rel-id>` → `main` if the human asked.
4. After the human merges release → main:
   a. Agent merges `release/<rel-id>` → `test` and records the result
   (success / conflict) in `docs/releases/<rel-id>.md`.
   b. If both merges succeeded, agent deletes `release/<rel-id>` and records
   the deletion in the same file.
   c. If the merge into test failed, agent leaves the branch in place and
   flags it for human resolution.
5. Run the smoke checklist only if a production URL and authorization exist;
   file a test report.

## Done

Release artifacts are ready, main and test are in sync on the released
commit (or a conflict is clearly flagged), the release branch is deleted
only after both merges succeed, and smoke evidence is filed. Production is
not deployed by the agent.
