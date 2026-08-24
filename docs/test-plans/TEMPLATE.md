# Test plan: <feature-id>

- Work item:
- Issue:
- Risk level: Low | Medium | High | Critical
- Status: DESIGNED | (execution later)
- Owner:
- Source:
- Open Questions:
- Approval:
- Traceability:
- Impact summary:

## In scope

- TC-###

## Out of scope

- (and why)

## Regression pack

- None | listed TCs | full pack

## Environments

## Entry / exit criteria (per level)

Entry: designed TCs with P/N/E (or BLOCKED + reason); environments named.

Exit (Gate 3 / DoD — High):

- **Unit:** specified P/N/E for field rules **executed** (or N/A if no fields).
- **Integration:** RLS / audit cases **PASSED** with evidence, or **BLOCKED**
  (missing secrets/oracle). SKIPPED is not exit.
- **E2E:** in-scope use-case P (and specified N) **PASSED** or **BLOCKED**.
- **Smoke:** listed production paths only; PASS is not full TC PASS.

Do not exit while required High TCs are SKIPPED without a human BLOCKED record.

## Healing

Failures go to the `heal` skill; re-execution uses `execute-tests`.
