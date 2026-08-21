---
name: release-and-verify
description: Prepare a release from test to main and describe post-deploy smoke. Never merge main or deploy production. Use at READY_FOR_RELEASE and RELEASED.
---

# Release and verify

## Rules

- Only after human QA approval (READY_FOR_RELEASE).
- Agent prepares the release branch and the release → main PR, and release notes.
- Agent does not merge to main. Only a human merges the release branch into main.
- After the human has merged release → main, the agent automatically merges the
  same release branch into test as well, so that main and test point to the
  same release commit. This sync merge is done by the agent without waiting
  for separate human approval, since it only replays an already-approved change.
- If the release → test merge fails (e.g. conflicts, test has diverged), the
  agent does NOT force it or delete the branch. It stops and reports the
  conflict to the human in the release notes file.
- Once the release branch has been successfully merged into both main and
  test, the agent automatically deletes the release branch (remote branch).
  The branch is never deleted before both merges are confirmed successful.
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
