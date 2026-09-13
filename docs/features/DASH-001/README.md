# DASH-001: CRM Dashboard

- Risk: **High** (reads Client/product tables under existing RLS; PII
  columns must not be fetched for KPIs)
- State: **`SPECIFIED`** — docs pack. Not `IN_DEVELOPMENT`. Not
  `RELEASED`. AUTH-001 and CRM-001 stay **`RELEASED`**.
- GitHub Issue: none (App/MCP). DoR + metric contracts accepted in
  chat 2026-09-13 (“odobreno” on the Cursor DASH-001 plan).
- Depends on: AUTH-001, CRM-001 (`RELEASED`)

Do not implement `src/` or `tests/` until
[implementation-plan.md](implementation-plan.md) is **Approved** and
the human asks to code. Agent does not merge `main`.

| Artifact            | File                                             |
| ------------------- | ------------------------------------------------ |
| REQ                 | [requirement.md](requirement.md)                 |
| FS                  | [functional-spec.md](functional-spec.md)         |
| TS                  | [technical-spec.md](technical-spec.md)           |
| Decision log        | [decisions.md](decisions.md)                     |
| User stories / AC   | [user-stories.md](user-stories.md)               |
| BDD                 | [bdd.md](bdd.md)                                 |
| Test cases          | [test-cases.md](test-cases.md)                   |
| Test plan           | [test-plan.md](test-plan.md)                     |
| Traceability        | [traceability.md](traceability.md)               |
| Implementation plan | [implementation-plan.md](implementation-plan.md) |
