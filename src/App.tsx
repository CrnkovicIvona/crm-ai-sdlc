import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { RequireAdmin, RequireAuth, RequireGuest } from './auth/RequireAuth';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { AppShell } from './pages/AppShell';
import { ClientDetailPage } from './pages/ClientDetailPage';
import { ClientFormPage } from './pages/ClientFormPage';
import { ClientListPage } from './pages/ClientListPage';
import { HomeRedirect } from './pages/HomeRedirect';
import { LoginPage } from './pages/LoginPage';

function ClientRecordRoute() {
  const { role } = useAuth();
  if (role === 'ADMIN') {
    return <ClientFormPage />;
  }
  return <ClientDetailPage />;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route
            path="/login"
            element={
              <RequireGuest>
                <LoginPage />
              </RequireGuest>
            }
          />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="clients" replace />} />
            <Route path="clients" element={<ClientListPage />} />
            <Route
              path="clients/new"
              element={
                <RequireAdmin>
                  <ClientFormPage />
                </RequireAdmin>
              }
            />
            <Route path="clients/:id" element={<ClientRecordRoute />} />
          </Route>
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
