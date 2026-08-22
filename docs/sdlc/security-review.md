# Security review

Perform a security review at the level required by risk before
`READY_FOR_PR`.

## Always (any code change, when app exists)

- No secrets in the diff
- No new public endpoints without authz notes
- Dependencies reviewed at a glance for unexpected additions

## High / Critical (auth, PII, money, admin)

- Authentication and session handling (fail-closed if profile/role missing)
- Authorization on every sensitive operation (UI is not enough)
- PostgreSQL RLS as data boundary; never ship service role to the client
- Destructive operations (DELETE) and append-only audit if in scope
- Injection (SQL, XSS, command)
- CSRF / CORS as applicable
- Least-privilege Supabase keys (anon vs service role never in the client)
- Logging without PII/secrets
- Follow [SECURITY.md](../../SECURITY.md)

The agent must not bypass controls to "make the demo work".
Human approval is required for security exceptions.
