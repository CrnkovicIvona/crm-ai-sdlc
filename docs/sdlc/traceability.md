# Traceability

IDs link work from request through tests.

| ID                                  | Artifact                          |
| ----------------------------------- | --------------------------------- |
| GitHub Issue number                 | Business request                  |
| `ENG-###` / `AUTH-###` / feature id | Work item (example prefixes only) |
| `REQ-###`                           | Requirement                       |
| `US-###`                            | User story                        |
| `AC-###`                            | Acceptance criterion              |
| `TC-###`                            | Test case                         |
| `BUG-###`                           | Bug                               |
| `ADR-###`                           | Architecture decision             |
| `REL-###`                           | Release                           |

## Matrix

The canonical table is [../traceability/matrix.md](../traceability/matrix.md).

Columns: Issue → REQ → US → AC → BDD → TC → automated test path → risk.

## Rules

- Do not add matrix rows for requirements that are not in
  `docs/requirements/` (or product truth).
- Commits, branches, and PRs should include the work item ID.
- Automated test paths are filled only when those files exist.

Feature IDs are assigned by humans (Issues/Projects). The agent must
not mint product feature IDs for unstated capabilities. `ENG-001` is
the foundation work item.
