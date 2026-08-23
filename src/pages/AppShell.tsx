import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export function AppShell() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <main data-testid="crm-shell">
      <h1>BankCRM</h1>
      <p data-testid="user-role">{role}</p>
      {role === 'ADMIN' ? (
        <p data-testid="admin-write-hint">
          Write actions will be available when CRM records exist.
        </p>
      ) : null}
      {role === 'VIEWER' ? (
        <p data-testid="viewer-read-hint">Read-only access.</p>
      ) : null}
      <button
        data-testid="logout"
        type="button"
        onClick={() => {
          void logout().then(() => {
            navigate('/login', { replace: true });
          });
        }}
      >
        Log out
      </button>
    </main>
  );
}
