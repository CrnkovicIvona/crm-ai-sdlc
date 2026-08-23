import { mapAuthError } from './errors';
import { getSupabase } from './supabase';

export async function signIn(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, message: mapAuthError() };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, message: mapAuthError(error) };
  }
  return { ok: true };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    return;
  }
  // Local scope: end this browser's session (FR-008). Global revoke of other
  // devices is out of AUTH-001 (concurrent sessions unspecified). See TS.
  await supabase.auth.signOut({ scope: 'local' });
}

export async function getSession() {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }
  const { data } = await supabase.auth.getSession();
  return data.session;
}
