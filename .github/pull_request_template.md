## Pull request

- **Target branch:** feature/bugfix/docs/chore → `test`. Release → `main`
  from `release/<rel-id>` (never `feature/*` → `main`).
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
- [ ] Did not create `src/` or `feature/` before `PLANNED`
- [ ] High risk: decision log + security notes (not SQL policies in spec PRs)
- [ ] Tests reported as passed were actually executed with evidence
- [ ] Tests not run are marked SKIPPED or NOT APPLICABLE, never passed
- [ ] Did not weaken CI, skip required tests, or commit secrets
- [ ] Conventional Commits
- [ ] Security review level appropriate to risk
- [ ] PR targets the correct branch
- [ ] Did not claim RELEASED unless production smoke PASSED (merge to main is ON_MAIN)
- [ ] SKIPPED tests are not recorded as PASSED

### Test evidence

| Suite      | Result                                 | Evidence |
| ---------- | -------------------------------------- | -------- |
| Prettier   | PASS / FAIL / MISSING / NOT APPLICABLE |          |
| commitlint | PASS / FAIL / MISSING / NOT APPLICABLE |          |
| gitleaks   | PASS / FAIL / MISSING / NOT APPLICABLE |          |
| ESLint     | PASS / FAIL / MISSING / NOT APPLICABLE |          |
| Vitest     | PASS / FAIL / MISSING / NOT APPLICABLE |          |
| Playwright | PASS / FAIL / MISSING / NOT APPLICABLE |          |

### Notes
