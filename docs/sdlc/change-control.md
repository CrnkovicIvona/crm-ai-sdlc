# Change control

The agent must not silently edit a single artifact when an approved
statement changes.

## Propagation

```
Change identified
  → impact analysis (list artifacts)
  → REQ (if business)
  → FS
  → US / AC
  → BDD
  → TC / test plan
  → TS / TDE
  → decision log / ADR (if a decision changed)
  → traceability
  → implementation plan (if READY or later)
  → implementation (only if PLANNED and plan updated + re-approved if scope grew)
```

A change to an approved **technical** decision needs technical impact
analysis (TS, ADR, plan, tests). A change to **AC** after BDD exists
needs BDD + TC updates in the same change.

If the change would invent a new TBD answer, **stop** for a human.

Re-DoR is required if behavior, roles, or data rules change after
Ready was recorded.
