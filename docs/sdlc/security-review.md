# Security review

Perform a security review at the level required by risk before
`READY_FOR_PR`.

## Always (any code change, when app exists)

- No secrets in the diff
- No new public endpoints without authz notes
- Dependencies reviewed at a glance for unexpected additions

## High / Critical (auth, PII, money, admin)

- Authentication and session handling
- Authorization on every sensitive operation
- Injection (SQL, XSS, command)
- CSRF / CORS as applicable
- Least-privilege Supabase keys (anon vs service role never in the client)
- Logging without PII/secrets
- Follow [SECURITY.md](../../SECURITY.md)

The agent must not bypass controls to "make the demo work".
Human approval is required for security exceptions.
