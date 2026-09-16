# Exploratory QA Report — YYYY-MM-DD

## Context

- Session:
- Date/time:
- Tester/agent: Cursor Agent (`exploratory-qa-expert`)
- Source branch:
- Environment: Production
- Live URL: https://crm-ai-sdlc.vercel.app/
- Backend: Production Supabase
- Database: Production database
- Browser tool: Playwright MCP (`browser_*`) | computer-use fallback | other (name it)
- Playwright MCP: available | unavailable
- Scope:
- Product code modified: **No**

Identities (no passwords):

- VIEWER: authenticated using the application's documented test-user
  mechanism. | not used (reason)
- ADMIN: authenticated using the application's documented test-user
  mechanism. | not used (reason)

Do not treat missing `E2E_*` as a blocker when the login-page
`test-users` aside is available.

## Charter

```text

```

## Oracle

- AUTH:
- CRM: (C008 BLOCKED unless docs change)
- DASH:
- Risk/lifecycle:

## Coverage

Per area and role. Status only: Explored, Partial, Blocked, Not
explored, N/A.

Do not label the whole session “Partially explored” because one area
is blocked.

| Area             | Unauthenticated | VIEWER | ADMIN | Status / notes |
| ---------------- | --------------- | ------ | ----- | -------------- |
| Authentication   |                 |        |       |                |
| Authorization    |                 |        |       |                |
| CRM list         |                 |        |       |                |
| CRM detail       |                 |        |       |                |
| CRM create       | N/A             |        |       |                |
| CRM edit         | N/A             |        |       |                |
| CRM delete       | N/A             |        |       |                |
| Dashboard        |                 |        |       |                |
| Session / logout |                 |        |       |                |
| Messy paths      |                 |        |       |                |

C008 search: Blocked — requirement remains BLOCKED (not a product
blocker for the rest of the session).

## Findings

Classify each as BUG, IMP, QUESTION, or OBSERVATION. Do not mark
TC-### PASSED.

The login-page `test-users` aside is **intended** for this practice
app. Do not file it as a security BUG. If AUTH FS/TS are silent,
optional QUESTION only.

### BUG

### IMP

### QUESTION

`TBD — HUMAN DECISION REQUIRED` where the oracle is silent.

### OBSERVATION

## Messy Paths

| Path            | Tried | Result | Finding |
| --------------- | ----- | ------ | ------- |
| Refresh         |       |        |         |
| Double Save     |       |        |         |
| Back/Forward    |       |        |         |
| Dirty state     |       |        |         |
| Cancel          |       |        |         |
| Partial input   |       |        |         |
| Role transition |       |        |         |
| Empty state     |       |        |         |
| Large input     |       |        |         |
| Direct URL      |       |        |         |

If not tried, give a precise reason (for example `Not tried —
production data safety`). Never invent a result.

## Not Explored / Blocked

Distinguish **Blocked** (external constraint, e.g. C008) from **Not
explored** (intentional, e.g. delete of a non-test client).

## Evidence

Steps, URLs, roles, screenshots/snapshots (paths), console/network
notes. No secrets or passwords.

## Confidence

High / Medium / Low — per important finding, not as severity.

## Follow-Up Recommendations

## Bugs promoted

| Session id | `docs/bugs/`    |
| ---------- | --------------- |
| BUG-S1-01  | BUG-### or none |

## Human QA Gate

Final approval: HUMAN QA REQUIRED

Human QA gate remains required.
