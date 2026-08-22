export type AppRole = 'ADMIN' | 'VIEWER';

export type AccessDecision = 'login' | 'app' | 'denied';

export function parseRole(value: unknown): AppRole | null {
  if (value === 'ADMIN' || value === 'VIEWER') {
    return value;
  }
  return null;
}

export function decideAccess(
  hasSession: boolean,
  role: AppRole | null,
): AccessDecision {
  if (!hasSession) {
    return 'login';
  }
  if (role === null) {
    return 'denied';
  }
  return 'app';
}
