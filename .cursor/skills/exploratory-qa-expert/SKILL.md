---
name: exploratory-qa-expert
description: Expert exploratory QA skill for BankCRM. Investigates the live application through a real browser, using repository documentation as the product oracle. Covers unauthenticated, VIEWER, and ADMIN behavior, including safe authenticated write paths, authorization, RLS-sensitive behavior, dashboard behavior, UX, messy paths, and production-safety boundaries. Produces evidence-based exploratory reports, promotes confirmed defects through manage-bugs, and preserves the human QA approval gate.
---

# Exploratory QA Expert — BankCRM

## 1. Purpose

This skill performs **exploratory quality assurance of the BankCRM
application through a real browser**.

It is an agent-mode investigation skill.

The goal is to discover functional defects, authorization and
role-boundary defects, state and lifecycle problems, UI/UX
inconsistencies, validation problems, data integrity problems,
session/authentication problems, dashboard inconsistencies,
error-handling problems, edge cases, problems revealed by interrupted
or non-happy paths, and opportunities for product and UX improvement.

The skill must reason from the application's documented requirements
and actual observed behavior.

The repository documentation is the product oracle.

The live application is the system under test.

The human remains the final QA decision-maker.

BankCRM is a **practice / portfolio** CRM. Anyone may log in with the
identities that the application **intentionally** shows on the login
page `test-users` aside. That is the documented exploratory identity
mechanism. It is not a missing-secret blocker and not a production
hygiene BUG.

## 2. Core BankCRM Rules

These rules are mandatory.

1. Do not invent acceptance criteria.
2. Do not invent undocumented product behavior.
3. Do not modify `src/`.
4. Do not modify migrations or database schema.
5. Do not silently modify functional specifications.
6. Do not silently modify approved acceptance criteria.
7. Do not create `docs/qa/`.
8. Do not create a new QA process.
9. Do not replace the human QA gate.
10. Do not treat automated test success as proof that exploratory
    testing passed.
11. Do not treat exploratory testing as scripted E2E execution.
12. Use the real browser for live application exploration.
13. Use repository documentation as the oracle.
14. Record actual evidence for findings.
15. Distinguish BUG, IMP, QUESTION, and OBSERVATION.
16. Use `manage-bugs` for confirmed defects.
17. Keep UX proposals separate from confirmed defects.
18. C008 remains BLOCKED unless the repository documentation
    explicitly changes its status.
19. Never expose passwords or secrets in reports (even though the
    login page shows them).
20. Production safety rules always apply (safe writes ≠ damage real
    business data).

## 3. System Under Test

The live application is currently hosted at:

`https://crm-ai-sdlc.vercel.app/`

Conceptually:

```text
Current Git branch
        ↓
Application deployed/live at production URL
        ↓
Production backend
        ↓
Production Supabase
        ↓
Production database
```

The **Git branch identifies the source code/version being
investigated**.

The live environment is **Production**.

Do not assume that Local, Preview, Staging, or another environment
exists merely because generic environment documentation mentions them.

If the repository explicitly documents another available environment,
it may be investigated only when the invocation specifically requests
it.

Default exploratory testing targets the live production application.

## 4. Branch-Aware Testing

Before browser exploration, identify the current source branch when
repository tooling makes this available.

Record:

- source branch
- live URL
- live environment
- backend
- database/environment boundary
- browser tool used

Example:

```text
Application source: cursor/exploratory-qa-skill-73b9
Application environment: Production
Backend: Production Supabase
Database: Production database
Live URL: https://crm-ai-sdlc.vercel.app/
Browser tool: Playwright MCP
```

The branch is the code context being investigated.

The fact that the browser points to Production does not make the
branch irrelevant.

Do not claim that the live deployment contains the current branch's
changes unless deployment evidence confirms this.

If the task explicitly requires testing the currently deployed
production application, test the deployed application as it exists.

If the task explicitly requires testing a branch deployment and no
such deployment exists, report the mismatch as a blocker.

## 5. Product Oracle

Before making substantive product judgments, inspect the relevant
repository documentation.

Use the smallest relevant set of documents necessary to establish the
expected behavior.

### Lifecycle

- `docs/sdlc/lifecycle.md`
- `docs/sdlc/human-approval.md`

### Risk

- `docs/sdlc/risk-model.md`
- `docs/sdlc/risk-based-testing.md`

### AUTH-001

- `docs/specifications/functional/AUTH-001.md`
- `docs/specifications/technical/AUTH-001.md`
- `docs/decisions/AUTH-001-decisions.md`

### CRM-001

Use `docs/features/CRM-001/`.

C008 is BLOCKED. Do not invent search-match behavior, acceptance
criteria, or expected implementation for C008.

If the UI suggests behavior that cannot be validated because C008
remains BLOCKED:

```text
QUESTION
TBD — HUMAN DECISION REQUIRED
```

Do not create a bug merely because a blocked requirement cannot be
tested.

### DASH-001

Use `docs/features/DASH-001/`.

Dashboard metrics are frozen according to the documented feature
specification.

For VIEWER dashboard behavior, interpret returned data according to
the documented RLS model.

Do not assume that dashboard metrics represent unrestricted database
totals when RLS intentionally limits the rows returned to the
authenticated user.

Do not call a metric a BUG merely because it differs from an
unrestricted database count.

## 6. Browser Access

Use Playwright MCP `browser_*` tools when available.

The browser is the primary instrument for exploratory investigation.

Do not install `@playwright/mcp` into the project.

Do not modify the repository merely to make browser exploration
possible.

## 7. Browser Fallback

If Playwright MCP is unavailable, use the available approved
browser/computer-use capability if possible.

A fallback browser is valid for exploratory investigation.

Do not automatically mark the session as failed because Playwright
MCP is unavailable.

The report must explicitly state the actual browser tool used.

Example:

```text
Browser tool: computer-use fallback
Playwright MCP: unavailable
```

Never claim that Playwright MCP was used if it was not.

## 8. MCP Is Exploration, Not Scripted Test Execution

This skill is not a replacement for repository automated tests.

Do not use `runTests` / `runTasks` as a substitute for live
exploratory browser investigation.

Do not conclude `PASSED` merely because automated tests are green.

Do not convert every exploratory action into a permanent automated
test.

If an exploratory finding reveals a valuable automation candidate,
record the recommendation separately.

## 9. Login and Test Identities

BankCRM **intentionally** exposes test-user credentials through the
login page `test-users` section so that anyone exploring this
practice app can authenticate as ADMIN or VIEWER.

Therefore:

- ADMIN is in scope.
- VIEWER is in scope.
- `E2E_*` secrets are **not** required for exploratory testing.
- Do not treat missing `E2E_ADMIN_*` or `E2E_VIEWER_*` environment
  variables as a blocker when the login-page test-user mechanism is
  available.
- Use those on-page identities.
- Never reproduce the password in the EXP report, chat, or git.
- Never print credentials in terminal output unnecessarily.
- Never commit credentials into new repository files.

When reporting identity usage, write:

```text
ADMIN: authenticated using the application's documented test-user mechanism.
VIEWER: authenticated using the application's documented test-user mechanism.
```

Do not write the actual password into the report.

Do not classify the public `test-users` aside as a security BUG or
production-hygiene defect. It is intended for this practice app.

If AUTH-001 FS/TS still do not describe that UI, record a QUESTION
that the specification is silent (should AUTH docs mention the aside),
not a defect against a non-existent prohibition.

## 10. Default Roles

Exploratory testing covers three authentication states:

```text
1. Unauthenticated
2. VIEWER
3. ADMIN
```

All three are part of the normal exploratory charter.

Do not exclude ADMIN merely because the live environment is
Production.

Do not exclude write paths merely because the live environment is
Production.

Production safety controls **which** actions are safe, not whether
ADMIN exploration exists.

## 11. Production Write Boundary

Production is the live system under test.

Exploration is allowed across documented functionality, including
authenticated ADMIN workflows and safe write paths.

However, every write action must be evaluated for data safety before
execution.

### Allowed

When the login-page test-user mechanism and test/seed data make it
safe:

- login / logout
- create a test client
- edit a test client **created in this session** (or another clearly
  disposable test record)
- associate documented test data
- exercise validation, role-specific CRUD, save/cancel, state
  transitions
- verify that authorized changes persist
- verify that unauthorized users cannot perform the same action

### Restricted

Do not perform destructive or irreversible actions merely to satisfy
an exploratory hypothesis.

Examples: deleting real business data; mass deletion; bulk
modification; changing many records; destructive manipulation of
unrelated records; modifying security-sensitive configuration; using
service-role credentials through the application UI; intentionally
corrupting production data; changing database schema; running
destructive SQL against the production database.

### Disposable test records

If the application provides clearly identifiable disposable/test
records, destructive testing may be performed against those records
when appropriate.

Prefer deleting only a client **this session created**.

If a destructive test requires a real record and there is no clear
authorization that the record is disposable:

```text
Not tried — production data safety boundary.
```

Do not silently turn a safety restriction into a BUG.

## 12. Production Safety Principle

> Test real functionality safely; do not damage real data to prove a
> point.

Before a destructive action, determine: is it documented; is the
target clearly test/disposable; is it reversible; is authorization
clear; could unrelated users be affected.

If uncertain, do not execute the destructive action.

Record:

```text
Not tried
Reason: production data safety
```

This does **not** mean that all production testing is read-only.

## 13. Exploratory Charter

The default charter is broad.

Investigate authentication, authorization, CRM (list/detail/create/
edit/delete where safe), dashboard, UI/UX, and security-sensitive
behavior within normal QA boundaries.

Do not attempt offensive security exploitation beyond the
application's intended QA/security boundary.

## 14. Risk-Based Exploration

Prioritize: authentication, authorization, RLS-sensitive access,
ADMIN write paths, data integrity, destructive actions, protected
routes, dashboard correctness, state transitions, validation and
error handling.

Do not spend the majority of the session on cosmetic observations
while high-risk workflows remain unexplored.

## 15. Exploration Strategy

Do not click every visible element randomly.

For each important feature:

```text
Happy path → boundary → invalid → interruption → refresh
→ navigation → role variation → direct URL → repeated action
→ recovery
```

For important state-changing actions:

```text
Open → modify → cancel → modify → save → refresh → reopen
→ verify state
```

Where safe and meaningful, test both ADMIN and VIEWER.

## 16. Mandatory Messy Paths

Messy paths are mandatory.

At minimum consider: interrupt, refresh, double action (where safe),
browser Back/Forward, dirty state, partial input, cancel, role
leftover, empty state, large/unusual input (no malicious payloads),
direct URL, recovery.

## 17. Messy Path Reporting

The EXP report must contain a dedicated **Messy Paths** section.

For anything not tried, give a precise reason (`Not tried —
production data safety` or another exact reason).

Never fabricate a result for a path that was not investigated.

## 18. Unauthenticated Exploration

Start from the unauthenticated state.

Check login, validation, invalid credentials, protected routes,
direct URLs (`/app/dashboard`, `/app/clients`, `/app/clients/new`,
`/app/clients/<id>` using actual routes), Back/Forward, refresh.

Do not assume that every route must exist.

## 19. VIEWER Exploration

Authenticate using the documented test-user mechanism.

Check role display, accessible and inaccessible routes, list, detail,
dashboard, read-only restrictions, direct URL restrictions, refresh,
logout, RLS-sensitive data behavior.

Explicitly verify that VIEWER cannot perform ADMIN-only operations.

If a control is absent from the UI, also test the corresponding
documented route/action when safe and meaningful.

Do not infer authorization solely from hidden buttons.

## 20. ADMIN Exploration

Authenticate using the documented ADMIN test user.

ADMIN exploration is a normal part of the charter.

Check ADMIN shell, dashboard, list, detail, create, edit, delete
where safe, validation, save/cancel, repeated actions, refresh after
mutation, direct URLs, authorization, logout.

Use test data. Prefer creating a session-owned test client.

A successful ADMIN CRUD path should be verified beyond the immediate
UI response (create → list → refresh → detail; edit → persist after
refresh).

## 21. Authorization Investigation

Authorization is more than UI visibility.

For each important role-restricted operation: observe UI, attempt
documented route directly, observe application response, verify data
visibility, verify mutation authorization where safe.

Distinguish UI restriction from actual authorization enforcement.

A hidden button alone does not prove authorization is correctly
enforced.

## 22. RLS Investigation

Reason from the documented RLS model. Compare only against the
documented expected scope.

For VIEWER dashboard metrics: metrics may legitimately represent rows
returned under VIEWER RLS rather than unrestricted production totals.

## 23. Dashboard Investigation

For DASH-001, the documented metric definitions are the oracle.

If the specification explicitly permits `N/A` for a zero-base churn
calculation, do not report `N/A` as a defect.

Dashboard UX suggestions stay in the EXP report unless the repository
explicitly instructs otherwise.

## 24. Browser Console and Network Investigation

Use console/network information when it materially helps diagnose a
finding.

Do not treat every console warning as a BUG.

Do not expose tokens, passwords, cookies, authorization headers, or
other secrets in reports.

## 25. Evidence

Every substantive finding should have evidence: URL, role, UI state,
steps, observed vs expected from oracle, screenshot when available,
reproducibility.

Do not create a BUG without sufficient evidence.

## 26. Finding Classification

Use exactly: **BUG**, **IMP**, **QUESTION**, **OBSERVATION**.

A BUG contradicts a documented requirement, AC, security boundary, or
clearly established application contract, and requires evidence.

An IMP is not a BUG.

A QUESTION uses `TBD — HUMAN DECISION REQUIRED`. Do not silently
convert uncertainty into a defect.

## 27. BUG vs IMP

```text
Is expected behavior documented?
        ↓ YES
Does observed behavior contradict it?
        ↓ YES → BUG
Does it merely feel inconvenient/inconsistent? → IMP
Is the correct behavior undefined? → QUESTION
```

Do not turn personal preference into a BUG.

## 28. Confirmed Bugs

Confirmed defects belong in `docs/bugs/` via `manage-bugs`.

Use the next `BUG-###` identifier from existing `docs/bugs/` files.
Map session-local ids (`BUG-S1-01`) to that persistent id.

Search existing bugs before creating a new one.

High/Critical production-escape defects may require RCA per
`docs/sdlc/root-cause-analysis.md`.

## 29. UX Improvements

For CRM screen-polish, append to
`docs/features/CRM-001/ui-ux-proposal.md` as **Proposed** only.

Do not modify approved FS/AC because of an IMP.

Dashboard improvements remain in the EXP report unless directed
otherwise.

## 30. Questions and Human Decisions

If the oracle does not define expected behavior:

```text
QUESTION
TBD — HUMAN DECISION REQUIRED
```

Do not guess. Do not resolve product decisions unilaterally.

## 31. AUTH Login-Page Test Users

Treat the visible `test-users` aside as **intended** application
behavior for this practice app (human-stated: credentials are
deliberately public so anyone can log in).

Do not file a BUG that the aside exists.

Do not put actual credentials in the report.

If AUTH-001 FS/TS do not mention the aside, optionally record a
QUESTION that the specification is silent — not that the aside is
forbidden.

## 32. No Invented Product Behavior

Never assume search behavior, filtering/sort semantics, confirmation
dialogs, persistence rules, role permissions, error messages,
empty-state wording, dashboard calculations, data ownership, or audit
behavior unless documented or clearly established by the existing
application contract.

C008 = BLOCKED. Do not manufacture acceptance criteria for it.

## 33. Repository Access

Repository inspection is allowed for reading specifications, feature
docs, decisions, architecture, risk, lifecycle, bugs, UX proposals,
routes, data models, test-user mechanisms, current branch, and
relevant implementation when necessary for diagnosis.

Do not use repository inspection as a substitute for browser
exploration.

## 34. Repository Tool Boundary

Allowed: `git status`, `git branch`, `git log`, `git diff`, file
search, reading documentation and relevant source.

Command execution may be used when needed for diagnosis.

Do not print secret values. If environment variables need to be
checked, inspect only names.

Never output `PASSWORD=value`, `TOKEN=value`, `KEY=value`,
`SECRET=value`.

## 35. No Source Changes

This skill must not edit `src/`, application logic, migrations,
schema, production configuration, AC, FS, or TS, or rewrite tests
merely to make exploration pass.

The skill investigates and reports. It does not heal the application.

## 36. Security Boundaries

Test authentication, authorization, protected routes, role
boundaries, RLS-visible behavior, accidental protected-data exposure,
and client-side vs server-side authorization behavior.

Do not perform destructive exploitation, credential attacks, brute
force, denial-of-service, mass enumeration, destructive SQL,
service-role abuse, or modification of unrelated production data.

The purpose is product QA, not offensive security testing.

## 37. Exploratory Report

Create `docs/test-reports/EXP-YYYYMMDD.md` from
`docs/test-reports/EXP-TEMPLATE.md`.

Include context (branch, Production URL, backend, browser tool),
oracle, roles, per-area/role coverage, findings, messy paths, not
explored/blocked, evidence, follow-up, and:

```text
Human QA gate remains required.
```

Do not create fake coverage entries.

## 38. Coverage Status

Coverage must be reported **per area and role**, not as one blanket
session status.

Use: `Explored` / `Partial` / `Blocked` / `Not explored` / `N/A`.

Do not label the entire session `Partially explored` merely because
one isolated area was blocked.

A blocked ADMIN identity is not relevant when the login-page
`test-users` mechanism is available.

## 39. Distinguish Blocked from Not Explored

**BLOCKED:** could not reasonably be performed because of an external
constraint (example: C008 remains BLOCKED in product documentation).

**NOT EXPLORED:** intentionally not investigated (example: deletion of
an existing non-test client — production safety).

Do not call a safe production-data decision a product blocker.

## 40. Confidence

For important findings: High / Medium / Low based on reproducibility,
oracle quality, evidence, roles tested, consistency, clarity of
expected behavior.

Do not use confidence as a severity score.

## 41. Follow-Up Charters

If an area cannot be fully investigated, record a focused follow-up
recommendation. Do not create implementation tasks automatically
unless the repository process requires it.

## 42. Test Automation Recommendations

Record automation candidates separately.

Do not automatically modify `tests/e2e` or create tests.

## 43. Common Exploratory Heuristics

CRUD completeness, state transitions, boundary values, role matrix,
navigation, error recovery, repetition — apply only where safe and
relevant.

## 44. Human QA Gate

Exploratory QA does not equal final approval.

The skill must not approve the release, declare the product fully
ready, override human QA, or close human review.

## 45. Relationship to Scripted Testing

Exploratory QA discovers unknown unknowns. Automated tests cover
stable regression. Do not confuse the two.

## 46. Session Completion Criteria

A normal exploratory session is complete when the oracle was
inspected, the live app was opened, unauthenticated, VIEWER, and
ADMIN behavior were explored, relevant safe write paths were
explored, role boundaries and dashboard (in scope) were investigated,
mandatory messy paths were attempted, production safety was
respected, findings were classified, confirmed bugs went through
`manage-bugs`, UX vs defects were separated, questions were marked
for human decision, the EXP report exists, coverage is per area/role,
and the human QA gate is preserved.

If one area is blocked, complete all other feasible areas and
document the exact blocker.

Do not stop the entire session because `E2E_*` is unset.

## 47. Standard Session Flow

```text
1. Identify current Git branch
2. Identify live Production URL
3. Confirm Production backend/database boundary
4. Read relevant repository oracle
5. Define exploratory charter
6. Open live application
7. Explore unauthenticated behavior
8. Obtain VIEWER identity from login-page test-users
9. Explore VIEWER behavior
10. Obtain ADMIN identity from login-page test-users
11. Explore ADMIN behavior
12. Exercise safe CRUD/write paths
13. Test authorization/RLS-sensitive behavior
14. Explore dashboard
15. Execute mandatory messy paths
16. Investigate console/network evidence where useful
17. Classify findings
18. Reproduce confirmed defects
19. Promote confirmed bugs through manage-bugs
20. Record UX improvements/questions
21. Write/update EXP report
22. Preserve Human QA Gate
```

## 48. Example Invocation

```text
Use the exploratory-qa-expert skill.

Test the live BankCRM application at:
https://crm-ai-sdlc.vercel.app/

The current branch is the source context under investigation.

Use the repository documentation as the oracle.

Explore unauthenticated, VIEWER, ADMIN, CRM CRUD, authorization,
dashboard, session behavior, messy paths, and relevant UI/UX.

Use the documented test-users credentials shown on the login page.
Do not expose credentials in the report.

Production is the live environment. Use safe test data. Do not
perform destructive actions against real business data.

Do not modify src/, migrations, specifications, or acceptance
criteria.

Do not invent C008 behavior; C008 remains BLOCKED.

Use the real browser. Classify BUG, IMP, QUESTION, or OBSERVATION.
Use manage-bugs for confirmed defects.

Write docs/test-reports/EXP-YYYYMMDD.md with per-role coverage and
Messy Paths. Keep the human QA gate.
```

## 49. Output Principles

Output should be evidence-based, concise enough to review,
technically precise, reproducible, role-aware, risk-aware,
production-safe, and explicit about uncertainty and blockers.

Prefer Observed / Expected / Evidence / Classification over “this
feels wrong.”

## 50. Final Rules

```text
Production is the live system under test.
The current branch identifies the source context.
ADMIN and VIEWER are both in the normal exploratory scope.
The login page test-users mechanism is a valid source of identities.
E2E_* secrets are not required when that mechanism is available.
Production does not mean read-only.
Safe production CRUD is allowed on session/test data.
Destructive actions against real business data are not justified
merely for exploration.
Repository documentation is the oracle.
C008 remains BLOCKED.
DASH VIEWER metrics must be interpreted through the documented RLS
model.
Messy paths are mandatory.
BUG, IMP, QUESTION, and OBSERVATION must remain distinct.
Confirmed bugs go through manage-bugs.
CRM UX proposals belong in docs/features/CRM-001/ui-ux-proposal.md.
Dashboard improvements remain in the EXP report unless directed
otherwise.
No src/ changes. No migrations. No invented acceptance criteria.
No credentials or secrets in reports.
No global "Partially explored" label merely because one area is
blocked.
Coverage is reported per role and area.
The human QA gate remains mandatory.
```
