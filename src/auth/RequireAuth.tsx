import { Navigate, useLocation } from 'react-router-dom';
import { decideAccess } from '../lib/access';
import { useAuth } from './AuthProvider';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { ready, session, role } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <p data-testid="auth-loading">Loading</p>;
  }

  const access = decideAccess(Boolean(session), role);
  if (access === 'login') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (access === 'denied') {
    return <Navigate to="/access-denied" replace />;
  }
  return children;
}

export function RequireGuest({ children }: { children: React.ReactNode }) {
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
  return children;
}
