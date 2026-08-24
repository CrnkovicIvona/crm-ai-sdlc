import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSession, signOut as authSignOut } from '../lib/auth';
import type { AppRole } from '../lib/access';
import { readOwnRole } from '../lib/profile';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

type AuthState = {
  ready: boolean;
  session: Session | null;
  role: AppRole | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const acceptSession = useRef(true);

  const applySession = useCallback(async (next: Session | null) => {
    if (!next) {
      setSession(null);
      setRole(null);
      setReady(true);
      return;
    }
    acceptSession.current = true;
    setReady(false);
    const nextRole = await readOwnRole();
    setSession(next);
    setRole(nextRole);
    setReady(true);
  }, []);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      await applySession(null);
      return;
    }
    const next = await getSession();
    await applySession(next);
  }, [applySession]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      void applySession(null);
      return;
    }
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'TOKEN_REFRESHED') {
        if (!acceptSession.current || !nextSession) {
          return;
        }
        setSession(nextSession);
        return;
      }
      if (!acceptSession.current && nextSession) {
        return;
      }
      void applySession(nextSession);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [applySession]);

  const logout = useCallback(async () => {
    acceptSession.current = false;
    await authSignOut();
    await applySession(null);
  }, [applySession]);

  const value = useMemo(
    () => ({ ready, session, role, refresh, logout }),
    [ready, session, role, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
