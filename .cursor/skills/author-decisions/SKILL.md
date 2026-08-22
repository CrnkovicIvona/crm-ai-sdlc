---
name: author-decisions
description: Draft or update a work-item decision log. Use for High-risk features before DoR. Never mark decisions approved without a recorded human statement.
---

# Author decisions

Place: `docs/features/<ID>/decisions.md` (new work) or
`docs/decisions/<ID>-decisions.md` (AUTH-001).

Template: `docs/decisions/TEMPLATE.md`.

## Rules

- Separate **BD-** (business) and **TD-** (technical).
- Status is `PROPOSED — HUMAN APPROVAL REQUIRED` until a human
  accepts, rejects, or changes the item on the Issue or in chat for
  that ID.
- Do not copy Proposed values into FS/TS as approved.
- After human approval, update the log **and** propagate via
  `docs/sdlc/change-control.md`.
- Promote to `docs/adr/` only if the choice is platform-wide
  (`author-adr`). Vite is ADR-0002; do not reopen it.
- Do not ADR table column lists.

## Done

Log exists, each open item is explicit, no silent approvals.
