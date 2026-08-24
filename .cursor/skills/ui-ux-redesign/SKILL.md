---
name: ui-ux-redesign
description: Audit existing BankCRM screens and write UX/UI redesign
  proposals (layout, hierarchy, validation copy) without changing
  business logic. Use when the user asks for UI redesign, UX pass,
  visual polish, form layout, or validation-message wording.
---

# UI/UX redesign (proposals)

This skill produces **proposals**, not a new product increment. It does
not invent entities, fields, roles, or routes. AUTH-001 and CRM-001
behavior stays as approved until a human picks items from the proposal
and asks for implementation.

Do **not** treat this as a bypass of Gate 1. Call it only against
**already specified/implemented screens** (`PLANNED`+ for CRM-001;
AUTH-001 `RELEASED` shell/login).

Canonical output for CRM-001:
`docs/features/CRM-001/ui-ux-proposal.md`.

## Forbidden

- New CRM entities, fields, pages, or Product admin
- Restore of soft-deleted Clients, DASH-001, audit UI
- Changing RLS, Auth, or fail-closed access
- Removing or renaming `data-testid` values
- Silent edits to approved BD-T copy (success/empty/generic error)
  without marking them **Proposed** and stopping for the PO
- New CSS frameworks or leaving ADR-0002 (Vite + React)
- Implementing CSS/layout in the same turn as the first proposal
  unless the PO already selected items

## Steps

1. Inventory current screens: login, access denied, app shell, client
   list (search, pager, empty), create/edit (including product
   checkboxes), VIEWER detail, delete confirm.
2. Read AUTH-001 and CRM-001 functional specs / implementation plan
   for frozen copy, AC, and testids.
3. Note UX problems: scan order, spacing, form errors, empty/loading,
   VIEWER vs ADMIN affordances, contrast.
4. Write or update `docs/features/CRM-001/ui-ux-proposal.md`:
   - per-screen audit
   - layout recommendations
   - optional **Proposed** validation/success wording (not applied)
   - must-not-change list (testids, routes, roles, RLS)
   - status **Proposed — waiting for PO**
5. **STOP.** Do not implement until the PO names which items to apply.
6. If the PO approves implementation: visual + approved copy only;
   keep testids; run unit tests; Playwright must still pass or skip
   with secrets (skipped ≠ passed). Do not merge `main`.

## When to invoke

User asks to redesign, polish, improve UX, regroup the GUI, or
reword field errors. After `feature-orchestrator` has classified
state as `PLANNED` / `IN_DEVELOPMENT` for CRM-001 (or AUTH screens
already on `main`).
