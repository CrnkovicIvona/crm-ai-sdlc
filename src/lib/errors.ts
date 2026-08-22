export const GENERIC_AUTH_ERROR = 'Authentication failed.';

export function mapAuthError(cause?: unknown): string {
  void cause;
  return GENERIC_AUTH_ERROR;
}
