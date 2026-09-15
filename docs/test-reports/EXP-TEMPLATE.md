# Exploratory session: EXP-YYYYMMDD

- Session:
- Date:
- Tester / agent:
- Environment: Local Vite | Preview | Production
- URL:
- Role(s): unauthenticated | VIEWER | ADMIN
- Charter:
- Oracle:
- Risk focus:
- Browser tool: Playwright MCP (`browser_*`) | BLOCKED | other (name it)
- Product code modified: **No**

## Charter

```text

```

## Coverage

| Area           | Role | Status                                                 | Notes |
| -------------- | ---- | ------------------------------------------------------ | ----- |
| Authentication |      | Explored / Partially explored / Blocked / Not explored |       |
| CRM            |      |                                                        |       |
| Dashboard      |      |                                                        |       |

Status values only: Explored, Partially explored, Blocked, Not
explored.

## Happy path

## Messy paths

| Messy path                             | Status            | Result / reason if not tried |
| -------------------------------------- | ----------------- | ---------------------------- |
| Interrupt form + Back                  | Tried / Not tried |                              |
| Refresh after Save                     |                   |                              |
| Double Save / submit                   |                   |                              |
| Browser Back / Forward                 |                   |                              |
| Dirty / stale / extra tab              |                   |                              |
| Partial / Cancel                       |                   |                              |
| Role leftover (logout then other role) |                   |                              |
| Empty / large / dashboard period       |                   |                              |
| Direct URL (unauth / VIEWER / ADMIN)   |                   |                              |

“Not tried” without a reason is incomplete.

## Findings

Classify each as BUG, IMP, QUESTION, or OBSERVATION. Do not mark
TC-### PASSED.

### BUG

### IMP

### QUESTION

`TBD — HUMAN DECISION REQUIRED` where the oracle is silent.

### OBSERVATION

## Evidence

Steps, screenshots/snapshots (paths), console/network notes. No
secrets.

## Confidence

High / Medium / Low — and why.

## Areas not explored

## Blockers

## Follow-up charters

## Bugs promoted

| Session id | `docs/bugs/`    |
| ---------- | --------------- |
| BUG-S1-01  | BUG-### or none |
