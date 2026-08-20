# Production readiness

Complete before a release PR to `main`.

- [ ] `test` CI green without weakened gates
- [ ] QA approval recorded
- [ ] Test report attached; residual risk accepted by a human
- [ ] Security review done at required level
- [ ] No secrets in the tree
- [ ] Migrations (when they exist) reviewed; **not** applied to production by the agent
- [ ] Environment variables documented in the environments guide; values are in secret stores
- [ ] Rollback idea stated (revert PR / Vercel rollback — executed only by a human)
- [ ] Smoke checklist prepared
- [ ] Release notes in `docs/releases/`

Vercel Production and Supabase production are not configured in ENG-001.
This checklist still applies once those platforms are connected.
