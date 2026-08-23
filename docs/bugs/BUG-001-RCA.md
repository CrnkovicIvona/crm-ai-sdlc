# RCA: BUG-001

- Production escape: yes

## Impact

Users (and REL-003 smoke) who open `/app`, `/login`, or `/access-denied`
directly on Vercel Production get a Vercel 404 page instead of the SPA.
Login from `/` still works.

## Timeline

1. AUTH-001 merged to `main` (PR #12, SHA `45c5b7f`, 2026-08-22).
2. Vercel Production deployed. GitHub Actions did not run production
   smoke (CI does not run on `push` to `main`; no post-deploy job).
3. Playwright on PR/`test` used Vite, which fallbacks unknown paths to
   `index.html`, so TC-002 passed.
4. 2026-08-23: REL-003 production smoke failed step 1b. Repeats: 18/18
   404s.

## Immediate fix

`vercel.json` SPA rewrite to `index.html`.

## Root cause

Hosting config gap: React Router client routes were never declared to
Vercel. Not an AUTH logic bug and not a flaky test.

## Why it escaped

- No `vercel.json` in ENG-001 / AUTH-001.
- E2E never hit Vercel path rules.
- Production smoke is manual and ran after deploy.

## Corrective actions

- Add SPA rewrite.
- Re-run REL-003 step 1b on production after `main` deploy.
- Keep Playwright TC-002 (still valid once rewrite exists).

## Preventive actions

- Optional later: one post-deploy smoke on Production `deployment_status`
  (PO decision; not in this fix).
- Do not treat local Vite e2e as proof of production routing.

## Residual risk

Until rewrite is on Production, bookmarks to `/app` still 404. Rewrite
does not change AUTH-001 roles or RLS.
