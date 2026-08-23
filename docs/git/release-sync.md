# Release → test synchronization

After a **human** merges a **release PR** into `main`, the **release
branch** must be merged into `test`, then deleted. This is mechanical.
It is **not** a product-approval gate.

Canonical lifecycle: [../sdlc/lifecycle.md](../sdlc/lifecycle.md).
Branching: [branching.md](branching.md).

## What to merge

Merge **`release/<rel-id>`** (or `cursor/rel-…` alias) **into `test`**.

Do **not** use `main` → `test` as the normal mechanism. Squash merges
to `main` create a different SHA; the release branch still holds the
pre-squash history plus release notes that `test` may lack.

Keep the release branch until sync **succeeds**. Do not enable
GitHub “delete branch on merge” for these PRs.

## Hybrid model

### Primary: GitHub Actions

Workflow: [`.github/workflows/release-sync.yml`](../../.github/workflows/release-sync.yml)

Trigger: release PR (`release/**` or `cursor/rel-**`) **merged** into
`main`. Job: checkout, merge the **head branch** into `test`, push
`test`, delete the release branch **only if** the push succeeded.

**Limitation (do not fabricate success):** this repository’s default
Actions token permissions could not be read (API 403) during
remediation design. `test` did **not** require pull requests at that
time, so a `contents: write` job **may** be able to push. If the job
fails (permissions, ruleset, conflict), that is a **failed sync**, not
a passed one.

### Fallback: Cursor Agent

Use `.cursor/skills/release-and-verify/SKILL.md` on an **Agent** turn
when Actions did not sync. Ask mode cannot `git push`.

1. Merge the **same release branch** into `test` (no force).
2. If GitHub **rejects** the push, open a PR to `test` and state that
   this is a **protection fallback**, not a second QA gate.
3. Delete the remote release branch **only** after sync succeeds.
4. Record success or failure in `docs/releases/<rel-id>.md`.

Never claim sync succeeded without a merge/push result on `test`.

## Failure

- Do **not** delete the release branch
- Record the blocker in the release document and Issue comment
- Report the blocking condition to the human
