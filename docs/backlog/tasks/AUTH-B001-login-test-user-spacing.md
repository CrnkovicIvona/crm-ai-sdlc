# AUTH-B001 — Login test-user blocks spacing

**Area:** Auth  
**Priority:** Low  
**Status:** Proposed  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

On the login page test-user aside (`data-testid="test-users"`), the
ADMIN block, VIEWER block, and italic specification note sit too
close together. A human asked (chat 2026-09-19) to separate those
three parts visually with spacing.

Do **not** change emails, passwords, role copy, or the note text.
Do **not** treat this file as permission to edit `src/` until an
implementation plan is approved.

## Acceptance Criteria

**Not oracle until human DoR.** Proposed only:

- Clear vertical space after the ADMIN block (before “VIEWER user”).
- Clear vertical space after the VIEWER block (before the italic
  note).
- The italic note remains italic and is visually its own block.
- Existing login AC / e2e copy is unchanged.

## Steps

1. Keep this Proposed until a human accepts a docs or UI plan.
2. If accepted: CSS (and markup wrappers only if needed) on
   `LoginPage.tsx` / `index.css`; no new users; no copy rewrite.
3. Screenshot or e2e that the three blocks remain present.

## QA Test Cases

**DESIGNED** after plan only. None PASSED.

## Related Files

- [src/pages/LoginPage.tsx](../../../src/pages/LoginPage.tsx)
- [src/index.css](../../../src/index.css)

## Dependencies

- None
