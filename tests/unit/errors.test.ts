import { describe, expect, it } from 'vitest';
import { GENERIC_AUTH_ERROR, mapAuthError } from '../../src/lib/errors';

describe('mapAuthError (TC-007 / FR-009)', () => {
  it('returns one generic message for any failure', () => {
    expect(mapAuthError()).toBe(GENERIC_AUTH_ERROR);
    expect(mapAuthError(new Error('Invalid login credentials'))).toBe(
      GENERIC_AUTH_ERROR,
    );
    expect(mapAuthError({ message: 'User not found' })).toBe(
      GENERIC_AUTH_ERROR,
    );
  });
});
