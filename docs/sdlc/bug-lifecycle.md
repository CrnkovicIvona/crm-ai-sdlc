# Bug lifecycle

```
New → Triaged → Ready → In progress → Fixed → Verified → Closed
                                              ↘ Reopened
```

Use branch `bugfix/<bug-id>-<description>` and PR into `test`.

## Severity

| Severity | Meaning                                                      |
| -------- | ------------------------------------------------------------ |
| Critical | Outage, data loss, security breach, incorrect money movement |
| High     | Major feature broken, no workaround                          |
| Medium   | Feature impaired, workaround exists                          |
| Low      | Cosmetic or minor                                            |

## Records

Each bug has `docs/bugs/<bug-id>.md` linking Issue, AC/TC, and evidence.

High/Critical bugs and all production escapes require root cause
analysis ([root-cause-analysis.md](root-cause-analysis.md)).

Verification of a fix requires `execute-tests` with evidence. Healing
must not mark tests passed.
