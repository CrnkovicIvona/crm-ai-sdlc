import { parseRole, type AppRole } from './access';
import { getSupabase } from './supabase';

export async function readOwnRole(): Promise<AppRole | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) {
    return null;
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return parseRole(data.role);
}
