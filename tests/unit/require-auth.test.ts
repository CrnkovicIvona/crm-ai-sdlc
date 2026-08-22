import { describe, expect, it } from 'vitest';
import { decideAccess, parseRole } from '../../src/lib/access';

describe('decideAccess (fail-closed)', () => {
  it('sends unauthenticated users to login (TC-002)', () => {
    expect(decideAccess(false, null)).toBe('login');
    expect(decideAccess(false, 'ADMIN')).toBe('login');
  });

  it('denies a session without a usable role (AC-012)', () => {
    expect(decideAccess(true, null)).toBe('denied');
  });

  it('allows ADMIN or VIEWER into the CRM shell (TC-001)', () => {
    expect(decideAccess(true, 'ADMIN')).toBe('app');
    expect(decideAccess(true, 'VIEWER')).toBe('app');
  });
});

describe('parseRole (TC-009)', () => {
  it('accepts exactly one of ADMIN or VIEWER', () => {
    expect(parseRole('ADMIN')).toBe('ADMIN');
    expect(parseRole('VIEWER')).toBe('VIEWER');
    expect(parseRole('ADMIN,VIEWER')).toBeNull();
    expect(parseRole('')).toBeNull();
    expect(parseRole('admin')).toBeNull();
  });
});
