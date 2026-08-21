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

## Variables (names reserved for later)

Document actual names in `.env.example` when the app exists. Expected
families: public app URL, public Supabase URL and anon key, server-only
secrets. Exact names depend on the React framework chosen in ADR 0001.
