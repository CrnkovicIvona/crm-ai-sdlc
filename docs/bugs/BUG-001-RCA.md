# RCA: BUG-001

- Production escape: yes

## Impact

Users (and REL-003 smoke) who open `https://crm-ai-sdlc.vercel.app/login`
directly on Vercel Production get a Vercel 404 page instead of the login
SPA. Loading `/` still works; the client can then navigate to `/login`.

## Timeline

1. AUTH-001 merged to `main` (PR #12, SHA `45c5b7f`, 2026-08-22).
2. Vercel Production deployed. GitHub Actions did not run production
   smoke (CI does not run on `push` to `main`; no post-deploy job).
3. Playwright on PR/`test` used Vite, which fallbacks unknown paths to
   `index.html`, so local e2e passed.
4. 2026-08-23: REL-003 production smoke failed step 1b:
   unauthenticated `GET https://crm-ai-sdlc.vercel.app/login` → 404.
   Reconfirmed after PO correction that **1b is `/login`, not `/app`**.

## Immediate fix

`vercel.json` SPA rewrite to `index.html`.

## Root cause

Hosting config gap: React Router client routes were never declared to
Vercel. Not an AUTH logic bug and not a flaky test.

## Why it escaped

- No `vercel.json` in ENG-001 / AUTH-001.
- E2E never hit Vercel path rules.
- Production smoke is manual and ran after deploy.
- An earlier write-up used `/app` as step 1b; PO corrected the
  canonical unauthenticated GET to `/login`.

## Corrective actions

- Add SPA rewrite.
- Re-run REL-003 step 1b on production after `main` deploy, against
  `https://crm-ai-sdlc.vercel.app/login` only.
- Keep Playwright coverage of unauthenticated access (including TC-002
  `/app`); that is not the production smoke 1b URL.

## Preventive actions

- Optional later: one post-deploy smoke on Production `deployment_status`
  (PO decision; not in this fix).
- Do not treat local Vite e2e as proof of production routing.

## Residual risk

Until rewrite is on Production, bookmarks to `/login` still 404. Rewrite
does not change AUTH-001 roles or RLS.
