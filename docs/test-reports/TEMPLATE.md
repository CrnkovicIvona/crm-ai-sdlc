# Test report: <feature-id>

- SHA:
- Date:
- Plan:
- Risk level:
- Environment (Vite / Preview / Production URL):

## Summary

| Result                                              | Count |
| --------------------------------------------------- | ----- |
| Passed (executed, evidence cited)                   |       |
| Failed                                              |       |
| Not executed                                        |       |
| Skipped (runner/job)                                |       |
| Blocked (no oracle or High suite not run — secrets) |       |

Skipped and blocked are never passed.

## Requirement coverage

| AC     | TCs (P/N/E) | Result                                   |
| ------ | ----------- | ---------------------------------------- |
| AC-### |             | passed / failed / blocked / not executed |

Coverage % = ACs with at least one executed **passed** TC / ACs in
scope. Do not count skipped or blocked as covered.

## Exit criteria

| Level       | Criterion | Met?               |
| ----------- | --------- | ------------------ |
| Unit        |           | yes / no / n/a     |
| Integration |           | yes / no / blocked |
| E2E         |           | yes / no / blocked |
| Smoke       |           | yes / no / n/a     |

## Evidence

| Test   | Kind  | Result                                             | Evidence (command + log/CI URL) |
| ------ | ----- | -------------------------------------------------- | ------------------------------- |
| TC-### | P/N/E | passed / failed / not executed / skipped / blocked |                                 |

## Confirmation testing

Bugs retested (TC ids) or none.

## Residual risk

## Bugs filed

Never mark a test passed without verifiable execution evidence.
