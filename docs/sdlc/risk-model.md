# Risk model (process depth)

Classify every work item. Record the class in the Issue, REQ, and
test plan. Do not assume CRM features are Low.

## Low

Examples: docs typo, comment, formatting, copy-only UI with no data.

Artifacts: REQ (or Issue), short FS if product, US/AC if product,
tests as needed, traceability, lightweight TS if any code, DoR, plan.

May omit: decision log, detailed BDD, security review beyond secrets.

## Medium

Examples: isolated UI with no authz change; helper with limited data.

Additionally: detailed BDD where AC are non-trivial; TS covering
data/API; integration tests.

## High

Examples: authentication, authorization, personal data, financial
data, destructive operations (DELETE), audit, security-sensitive
changes.

Additionally: full FS, detailed TS, **decision log**, security
review before READY_FOR_PR, detailed test plan, explicit human
approval of BD/TD that affect access or data.

**AUTH-001** is High.

**CRM-001** is **High**: authorization (ADMIN vs VIEWER), personal
data (OIB, email, phone), destructive DELETE, audit trail, RLS.

## Critical

Production incident, vulnerability, data-loss path. Full pack, RCA,
human security and release gates.
