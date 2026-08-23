# Environments

BankCRM is intended to use:

- **Supabase** for PostgreSQL and authentication
- **Vercel** for Preview and Production hosting
- **GitHub Actions** for CI

None of these production or project integrations are configured in
ENG-001. Do not create Supabase schemas, Vercel project files, or
production deploy workflows until a later, approved phase.

## Intended topology (future)

| Name         | Git            | App               | Database / auth                      |
| ------------ | -------------- | ----------------- | ------------------------------------ |
| Local        | feature branch | developer machine | local or dedicated non-prod Supabase |
| Preview / QA | PRs and `test` | Vercel Preview    | non-production Supabase              |
| Production   | `main`         | Vercel Production | production Supabase                  |

## Secrets

- Never commit secrets
- `.env` files are gitignored
- `.env.example` will be added at application bootstrap with **names
  only**, no real keys
- Client bundles must never receive the Supabase **service role** key
- Production env vars live in Vercel/Supabase/GitHub secret stores

## Agent rules

- Do not apply migrations to production
- Do not modify production data without explicit human authorization
- Do not deploy production
- Do not invent connection strings

## Variables

Documented in `.env.example` (names only):

| Name                                       | Where                       | Purpose                                    |
| ------------------------------------------ | --------------------------- | ------------------------------------------ |
| `VITE_SUPABASE_URL`                        | Vite, Vercel                | Public Supabase URL                        |
| `VITE_SUPABASE_ANON_KEY`                   | Vite, Vercel                | Public anon key (never service role)       |
| `SMOKE_BASE_URL`                           | GitHub variable / local env | Production origin for `npm run test:smoke` |
| `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD`   | GitHub secrets              | Documented ADMIN test user                 |
| `E2E_VIEWER_EMAIL` / `E2E_VIEWER_PASSWORD` | GitHub secrets              | Documented VIEWER test user                |
| `SUPABASE_SERVICE_ROLE_KEY`                | GitHub secrets (CI Vitest)  | Non-prod service role for RLS cleanup only |

Production smoke does not hardcode the Production URL in test files.
Set `SMOKE_BASE_URL` (and GitHub Actions variable `SMOKE_BASE_URL` for
dispatch without a deployment URL). Agent does not deploy Production.
