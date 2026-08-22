import { useState, type FormEvent } from 'react';
import { signIn } from '../lib/auth';
import { useAuth } from '../auth/AuthProvider';
import { GENERIC_AUTH_ERROR } from '../lib/errors';

export function LoginPage() {
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const result = await signIn(email, password);
    setPending(false);
    if (!result.ok) {
      setError(GENERIC_AUTH_ERROR);
      return;
    }
    await refresh();
  }

  return (
    <main>
      <h1>BankCRM login</h1>
      <form onSubmit={onSubmit} data-testid="login-form">
        <label>
          Email
          <input
            data-testid="login-email"
            type="email"
            name="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            data-testid="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button data-testid="login-submit" type="submit" disabled={pending}>
          Log in
        </button>
      </form>
      {error ? (
        <p data-testid="login-error" role="alert">
          {error}
        </p>
      ) : null}
    </main>
  );
}
