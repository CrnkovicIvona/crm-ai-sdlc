# AGENTS.md

BankCRM is a Vite + React + TypeScript single-page CRM whose login and
role gating are backed by Supabase Auth. See `README.md`,
`CONTRIBUTING.md`, and `docs/sdlc/lifecycle.md` for product and process
truth. Follow `.cursor/rules/` and the `.cursor/skills/` procedures for
any feature work; this file only covers running the dev environment.

## Cursor Cloud specific instructions

The startup update script already runs `npm install` and
`npx playwright install chromium`, so dependencies and the e2e browser
are present when an agent starts. Commands below assume that state.

- Node 22 is available and satisfies the repo's `engines.node >= 20`.
- Standard commands live in `package.json` scripts: `npm run dev`
  (Vite dev server), `npm run lint`, `npm test` (Vitest), and
  `npm run test:e2e` (Playwright). `npm run format:check` runs Prettier.
- Run the dev server as `npm run dev -- --host 127.0.0.1 --port 5173`.
  Playwright's `webServer` expects it on `http://127.0.0.1:5173` and will
  reuse an already-running server outside CI.
- Supabase is optional for local dev. With no `VITE_SUPABASE_*` values,
  `getSupabase()` returns `null`, so the login page renders, any sign-in
  attempt shows the generic `Authentication failed.` message, and `/app`
  redirects unauthenticated users to `/login`. This is enough to exercise
  the app end to end without secrets.
- Credentialed Playwright cases (TC-001, TC-003–TC-006) are **skipped**,
  not passed, unless `E2E_ADMIN_*` / `E2E_VIEWER_*` and
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set against a
  non-prod Supabase project. A skip is never a pass. To run them, copy
  `.env.example` to `.env`, fill the public Supabase values, provide the
  `E2E_*` credentials, and ensure each Auth user has a `public.profiles`
  row with role `ADMIN` or `VIEWER` (a session reaching `/access-denied`
  means that row is missing).
- The unauthenticated e2e cases (TC-002, TC-007, TC-008) run with no
  secrets and are the quickest smoke check that the app works.
