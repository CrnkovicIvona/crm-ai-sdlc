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
- [ ] Executable production smoke exists under `tests/smoke/` for the
      release’s critical paths (not only a markdown checklist)
- [ ] Release notes in `docs/releases/` name the smoke files and how
      to run them
- [ ] After Production deploy: run `npm run test:smoke` (or the
      Production smoke workflow) and record PASSED/FAILED
- [ ] `sync-feature-docs` at `ON_MAIN` is in the release PR
- [ ] After merge: treat state as `ON_MAIN` until production smoke PASSED
- [ ] `RELEASED` only after smoke PASSED and docs/traceability on `main` are updated

Vercel Production and Supabase production are not configured in ENG-001.
This checklist still applies once those platforms are connected.
