import { Navigate } from 'react-router-dom';
import { decideAccess } from '../lib/access';
import { useAuth } from '../auth/AuthProvider';

export function HomeRedirect() {
  const { ready, session, role } = useAuth();
  if (!ready) {
    return <p data-testid="auth-loading">Loading</p>;
  }
  const access = decideAccess(Boolean(session), role);
  if (access === 'app') {
    return <Navigate to="/app" replace />;
  }
  if (access === 'denied') {
    return <Navigate to="/access-denied" replace />;
  }
  return <Navigate to="/login" replace />;
}
