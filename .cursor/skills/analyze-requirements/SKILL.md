---
name: analyze-requirements
description: Analyze a business request into requirements without inventing scope. Use when a feature is REQUESTED or in REQUIREMENTS.
---

# Analyze requirements

## Rules

- Use only the human request, linked issues, and existing `docs/product/` plus `docs/requirements/`.
- If information is missing, list questions. Do not invent answers.
- Do not silently expand scope.

## Steps

1. Identify the GitHub Issue (create a draft body if the human asked to start from a description, but do not fabricate acceptance).
2. Write or update `docs/requirements/<id>.md` from the template.
3. Mark unknowns explicitly as `TBD (human)`.
4. Update `docs/traceability/matrix.md` with the REQ row.
5. Hand off to `author-specifications` for the **functional**
   specification (`docs/specifications/functional/<id>.md`), then to
   `author-user-stories`. Do not skip the functional specification on
   new work.

## Done

Requirements file exists, IDs assigned, open questions listed, no invented product behavior. Functional specification is the next artifact, not application code.
