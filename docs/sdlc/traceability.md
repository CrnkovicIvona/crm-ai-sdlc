# Traceability

IDs link work from request through tests.

| ID                                  | Artifact                          |
| ----------------------------------- | --------------------------------- |
| GitHub Issue number                 | Business request                  |
| `ENG-###` / `AUTH-###` / feature id | Work item (example prefixes only) |
| `REQ-###`                           | Business requirement              |
| `FR-###`                            | Functional requirement            |
| `US-###`                            | User story                        |
| `AC-###`                            | Acceptance criterion              |
| `TC-###`                            | Test case                         |
| `TDE-###` / `TR-###`                | Technical design element          |
| `BUG-###`                           | Bug                               |
| `ADR-###`                           | Architecture decision             |
| `REL-###`                           | Release                           |

## Matrix

The canonical table is [../traceability/matrix.md](../traceability/matrix.md).

Chain: Business Requirement → Functional Requirement → User Story →
Acceptance Criterion → BDD Scenario → Test Case → Technical
Requirement / Technical Design Element → Implementation.

Columns: Issue → REQ → FR → US → AC → BDD → TC → TDE/TS → automated
test path / implementation → risk.

Implementation stays empty until `src/` (or equivalent) exists. Do
not invent implementation paths.

## Rules

- Do not add matrix rows for requirements that are not in
  `docs/requirements/` (or product truth).
- Commits, branches, and PRs should include the work item ID.
- Automated test paths are filled only when those files exist.

Feature IDs are assigned by humans (Issues/Projects). The agent must
not mint product feature IDs for unstated capabilities. `ENG-001` is
the foundation work item.
