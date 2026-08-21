# GitHub Issue draft: Bank employee login and roles

Created as GitHub Issue
[#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5).
Do not treat extra detail as an invented requirement.

**Proposed title:** `[FEATURE] AUTH-001 Bank employees must log in (ADMIN / VIEWER)`

**Proposed label:** feature (create the label if missing)

**Initial risk:** High

## Business request

Bank employees need to log into BankCRM before they can access the
application.

The application has two user roles:

- ADMIN — full access to the CRM
- VIEWER — read-only access

Only authenticated users may access the CRM.

Users must be able to log out.

## Open questions

See `docs/requirements/REQ-001.md`. Do not implement until a human
answers them and records Definition of Ready.
