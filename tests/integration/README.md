# Integration tests

Vitest files under this folder hit non-prod Supabase when
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, and `E2E_*` credentials are present.

If those secrets are missing, the suite is **skipped**. Skipped is not
passed. Do not add placeholders that pass without talking to Supabase.
