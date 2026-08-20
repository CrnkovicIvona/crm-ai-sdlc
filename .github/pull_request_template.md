## Pull request

- **Target branch:** feature/bugfix/docs/chore → `test`. Release → `main` from `test` only.
- **Do not merge `main` as an agent.** Human merge only for production.

### Work item

- Issue / ID:
- Lifecycle state:
- Risk: Low | Medium | High | Critical

### Traceability

- REQ / US / AC:
- Test plan:
- Test report:

### Checklist

- [ ] Did not invent or silently change requirements/AC
- [ ] Human gates that apply are recorded (DoR / plan / QA)
- [ ] Tests reported as passed were actually executed with evidence
- [ ] Tests not run are marked **not executed**, not passed
- [ ] Did not weaken CI, skip required tests, or commit secrets
- [ ] Conventional Commits
- [ ] Security review level appropriate to risk
- [ ] PR targets the correct branch

### Test evidence

| Suite      | Result                                   | Evidence |
| ---------- | ---------------------------------------- | -------- |
| Prettier   |                                          |          |
| commitlint |                                          |          |
| gitleaks   |                                          |          |
| Vitest     | not executed (no application) / evidence |          |
| Playwright | not executed (no application) / evidence |          |

### Notes
