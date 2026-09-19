# AUTH-B001 — Login test-user blocks spacing

**Area:** Auth  
**Priority:** Low  
**Status:** **`RELEASED`** (PR #55 on `test`; REL-007 PR #56; smoke
14/14 PASS, run 35469423656).  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

On the login page test-user aside (`data-testid="test-users"`), the
ADMIN block, VIEWER block, and italic specification note sit too
close together. Human approved implementation (chat 2026-09-19).

Do **not** change emails, passwords, role copy, or the note text.

## Acceptance Criteria

- Clear vertical space after the ADMIN block (before “VIEWER user”).
- Clear vertical space after the VIEWER block (before the italic
  note).
- The italic note remains italic and is visually its own block.
- Existing login emails/passwords/role copy unchanged.

## Steps

1. Wrap ADMIN and VIEWER in `.test-users-block`.
2. Column flex + `gap` on `.test-users`.
3. E2E: bounding boxes have a gap; note is italic.

## QA Test Cases

**DESIGNED / EXECUTED:** `tests/e2e/auth.spec.ts` TC-008 (spacing +
italic) on `test` CI
[run 35468058847](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/35468058847)
(included in Playwright 26 PASSED). Production smoke:
`tests/smoke/rel-007.spec.ts` test 1 — **PASSED** (run 35469423656).

## Related Files

- [src/pages/LoginPage.tsx](../../../src/pages/LoginPage.tsx)
- [src/index.css](../../../src/index.css)

## Dependencies

- None
