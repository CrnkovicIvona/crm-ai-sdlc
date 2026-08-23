import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export function AppShell() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div data-testid="crm-shell">
      <header className="crm-topbar">
        <h1>BankCRM</h1>
        <nav>
          <Link data-testid="nav-clients" to="/app/clients">
            Clients
          </Link>
        </nav>
        <p data-testid="user-role">{role}</p>
        {role === 'ADMIN' ? (
          <p data-testid="admin-write-hint">You can create and edit clients.</p>
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
      </header>
      <div className="crm-page">
        <Outlet />
      </div>
    </div>
  );
}
