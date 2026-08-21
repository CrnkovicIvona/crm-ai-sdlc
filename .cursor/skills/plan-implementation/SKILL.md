---
name: plan-implementation
description: Produce a technical implementation plan after Definition of Ready. Stop for human approval before coding the application.
---

# Plan implementation

## Rules

- Prerequisite: artifacts for SPECIFIED, and human DoR unless the human explicitly asked only for a draft plan.
- Do not start application source until the human approves this plan (READY → PLANNED).
- Do not invent requirements to fill design gaps; list them as blockers.

## Steps

1. Confirm DoR using `docs/sdlc/definition-of-ready.md`.
2. Propose files, interfaces, test automation mapping, security notes, and rollout risk.
3. Record the plan in the issue, PR description draft, or `docs/` only if the human asked for a durable doc.
4. Stop and wait for human approval.

## Done

Plan is reviewable. State remains `READY` until the human approves.
