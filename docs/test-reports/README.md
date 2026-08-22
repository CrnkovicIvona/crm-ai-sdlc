# Test reports

Use [TEMPLATE.md](TEMPLATE.md). Passed means executed with evidence.

CI (`scripts/update-ci-test-report.mjs`) rewrites **Latest CI** in
[AUTH-001](AUTH-001.md) when the commit SHA or Playwright counts change.
The first local execute-tests snapshot stays under **Historical snapshot**.
SKIPPED is never PASSED.

- [ENG-001](ENG-001.md)
- [AUTH-001](AUTH-001.md)
