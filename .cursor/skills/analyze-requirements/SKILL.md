---
name: analyze-requirements
description: Analyze a business request into requirements without inventing scope. Use when REQUESTED or SPECIFIED. New work goes in docs/features/<ID>/requirement.md.
---

# Analyze requirements

Read `docs/sdlc/roadmap.md` and AUTH-001 authorization before drafting
new CRM modules. Reuse ADMIN CRUD / VIEWER read+search. Do not recreate
AUTH-001.

## Rules

- Use only the human request, Issue, `docs/product/`, approved decision
  logs, and existing REQ.
- Missing information: `TBD — HUMAN DECISION REQUIRED`. Do not invent.
- Classify risk (`docs/sdlc/risk-model.md`).
- New features: `docs/features/<ID>/requirement.md`.
- AUTH-001: keep `docs/requirements/REQ-001.md`.

## Steps

1. Identify Issue (draft body if asked; do not fabricate AC).
2. Write REQ from the template.
3. List TBDs.
4. Update `docs/traceability/matrix.md`.
5. Hand off to `author-specifications` (functional). Do not skip FS
   on new product work.

## Done

REQ exists, risk stated, no invented behavior, no `src/`.
