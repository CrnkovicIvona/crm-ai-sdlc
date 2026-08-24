import { Link, Navigate } from 'react-router-dom';
import { decideAccess } from '../lib/access';
import { useAuth } from '../auth/AuthProvider';

export function AccessDeniedPage() {
  const { ready, logout, session, role } = useAuth();

  if (!ready) {
    return <p data-testid="auth-loading">Loading</p>;
  }

  const access = decideAccess(Boolean(session), role);
  if (access === 'login') {
    return <Navigate to="/login" replace />;
  }
  if (access === 'app') {
    return <Navigate to="/app" replace />;
  }

  return (
    <main className="crm-page-login" data-testid="access-denied">
      <h1>Access denied</h1>
      <p>Access to the CRM is denied.</p>
      <button
        data-testid="denied-logout"
        type="button"
        onClick={() => void logout()}
      >
        Log out
      </button>
      <p>
        <Link data-testid="denied-login-link" to="/login">
          Go to login
        </Link>
      </p>
    </main>
  );
}
