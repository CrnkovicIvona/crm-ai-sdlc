# DASH-001: CRM Dashboard

- Risk: **High** (reads Client/product tables under existing RLS; PII
  columns must not be fetched for KPIs)
- State: **`ON_MAIN`** after REL-006 merge. Plan approved 2026-09-14.
  Not `RELEASED` until production smoke **PASSED**. AUTH-001 and
  CRM-001 stay **`RELEASED`**.
- GitHub Issue: none (App/MCP). DoR + metric contracts accepted in
  chat 2026-09-13 (“odobreno” on the Cursor DASH-001 plan). Coding
  approved 2026-09-14.
- Depends on: AUTH-001, CRM-001 (`RELEASED`)

| Artifact            | File                                                                      |
| ------------------- | ------------------------------------------------------------------------- |
| REQ                 | [requirement.md](requirement.md)                                          |
| FS                  | [functional-spec.md](functional-spec.md)                                  |
| TS                  | [technical-spec.md](technical-spec.md)                                    |
| Decision log        | [decisions.md](decisions.md)                                              |
| User stories / AC   | [user-stories.md](user-stories.md)                                        |
| BDD                 | [bdd.md](bdd.md)                                                          |
| Test cases          | [test-cases.md](test-cases.md)                                            |
| Test plan           | [test-plan.md](test-plan.md)                                              |
| Traceability        | [traceability.md](traceability.md)                                        |
| Implementation plan | [implementation-plan.md](implementation-plan.md)                          |
| QA parking lot      | [../../backlog/backlog.md](../../backlog/backlog.md) (`DASH-B001`–`B012`) |
| BUG-004             | [../../bugs/BUG-004.md](../../bugs/BUG-004.md) (Triaged; RCA; plan Draft) |
