# Test reports

Use [TEMPLATE.md](TEMPLATE.md) for planned-suite reports. Passed means
executed with evidence.

Exploratory sessions: [EXP-TEMPLATE.md](EXP-TEMPLATE.md),
[../sdlc/exploratory-qa.md](../sdlc/exploratory-qa.md).

- [ENG-001](ENG-001.md)
- [AUTH-001](AUTH-001.md) — REL-003 smoke 5/5 on production (2026-08-23); live e2e on `1c98f14` CI **PASSED** (see report addendum)
- [CRM-001](CRM-001.md) — SHA `456c9a2` High pack; REL-005 smoke 7/7 **PASSED**
- [QA-CLOSEOUT-001](QA-CLOSEOUT-001.md) — Phase 6; human QA on `test` 2026-08-24; CRM-001 **`RELEASED`** after REL-005 smoke
- [ISTQB-QA-REVIEW](ISTQB-QA-REVIEW.md) — Phase 55+66; RLS **PASSED** CI `456c9a2`; C008 oracle still BLOCKED
- [EXP-2026-09-15](EXP-2026-09-15.md) — skill install; live UI **BLOCKED** (no Playwright MCP in that run)
- [EXP-2026-09-16](EXP-2026-09-16.md) — Production 16-3 aligned charter (unauth + VIEWER + ADMIN session CRUD) vs 16-2 comparison
- [EXP-2026-09-19](EXP-2026-09-19.md) — first-time user mental model; VIEWER/ADMIN; not DEEPLY on authz
