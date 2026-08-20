---
name: release-and-verify
description: Prepare a release from test to main and describe post-deploy smoke. Never merge main or deploy production. Use at READY_FOR_RELEASE and RELEASED.
---

# Release and verify

## Rules

- Only after human QA approval (`READY_FOR_RELEASE`).
- Agent prepares the `test` → `main` PR and release notes.
- Agent does **not** merge to `main` or trigger production deploy.
- Post-deploy smoke must be actually executed against production with evidence. If not executed, status is `not executed`.

## Steps

1. Confirm `docs/sdlc/production-readiness.md`.
2. Write `docs/releases/<rel-id>.md`.
3. Open release PR `test` → `main` if the human asked.
4. After the **human** merges, run the smoke checklist only if a production URL and authorization exist; file a test report.

## Done

Release artifacts are ready, or smoke evidence is filed. Production is not deployed by the agent.
