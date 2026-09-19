# Exploratory QA Report — YYYY-MM-DD

## Context

- Session:
- Date/time:
- Tester/agent: Cursor Agent (`exploratory-qa-expert`)
- Source branch:
- Deployed SPA (evidence): Production `https://crm-ai-sdlc.vercel.app/` | other
- Browser tool actually used:
- Playwright MCP: available | unavailable
- Product code modified: **No**

Identities (no passwords): login-page test-user mechanism — VIEWER /
ADMIN / not used (reason).

## Mission

What we are trying to **learn**:

## Risks (2–3)

## Hypotheses

Generated from this product (not copied from the skill):

1.
2.
3.

## Coverage

Use only: NOT EXPLORED | TOUCHED | PARTIALLY EXPLORED |
DEEPLY EXPLORED | BLOCKED | N/A.

High-risk areas need variation/investigation for DEEPLY. A happy path
is not enough.

| Area                | Unauth | VIEWER | ADMIN | State | Evidence of variation (or why not) |
| ------------------- | ------ | ------ | ----- | ----- | ---------------------------------- |
| Authn               |        |        |       |       |                                    |
| Authz / enforcement |        |        |       |       |                                    |
| CRM                 |        |        |       |       |                                    |
| Dashboard           |        |        |       |       |                                    |
| Session             |        |        |       |       |                                    |

C008 match: BLOCKED for conclusions about matching. Note any search
**UI** still investigated.

## Requirement-based findings

BUG / IMP / QUESTION / OBSERVATION against the oracle.

### BUG

### IMP

### QUESTION

`TBD — HUMAN DECISION REQUIRED`

### OBSERVATION

## Exploratory findings

Messy paths, mental model, UI clarity, spec-silent behavior. Same
four labels. Confidence and **severity/impact** separately.

## Evidence

Reproducible steps in **this file** (role, start state, actions,
important inputs without secrets, observed, expected if known). `/tmp`
logs are optional supplement only.

## Debrief

- Learned:
- Surprised:
- Risks investigated:
- Risks remaining:
- Anomalies to follow up:
- Disproven:
- Next:
- We can confidently say:
- We must **not** claim:

## Bugs promoted

| Session id | `docs/bugs/`    |
| ---------- | --------------- |
|            | none or BUG-### |

## Human QA Gate

Final approval: HUMAN QA REQUIRED
