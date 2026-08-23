import { getSupabase } from './supabase';
import {
  GENERIC_CLIENT_ERROR,
  isUniqueEmailViolation,
  type ClientInput,
  type FieldErrors,
} from './clientValidation';

export const CLIENT_PAGE_SIZE = 20;

export type ClientRecord = ClientInput & {
  id: string;
  created_at: string;
};

export type ClientListResult = {
  rows: ClientRecord[];
  total: number;
};

export type ClientMutationOk = { ok: true; record: ClientRecord };
export type ClientMutationErr = {
  ok: false;
  error: string;
  fields?: FieldErrors;
};
export type ClientMutationResult = ClientMutationOk | ClientMutationErr;

function client(): NonNullable<ReturnType<typeof getSupabase>> | null {
  return getSupabase();
}

function sanitizeSearch(raw: string): string {
  return raw
    .trim()
    .replace(/[,()]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}

function mapWriteError(
  error: { code?: string; message?: string } | null,
): ClientMutationErr {
  if (isUniqueEmailViolation(error)) {
    return {
      ok: false,
      error: GENERIC_CLIENT_ERROR,
      fields: { email: 'email' },
    };
  }
  return { ok: false, error: GENERIC_CLIENT_ERROR };
}

export async function listClients(
  query: string,
  page: number,
): Promise<
  { ok: true; data: ClientListResult } | { ok: false; error: string }
> {
  const supabase = client();
  if (!supabase) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const from = (safePage - 1) * CLIENT_PAGE_SIZE;
  const to = from + CLIENT_PAGE_SIZE - 1;
  const needle = sanitizeSearch(query);

  let request = supabase
    .from('clients')
    .select('id, first_name, last_name, email, phone, oib, created_at', {
      count: 'exact',
    })
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .range(from, to);

  if (needle) {
    const pattern = `"%${needle}%"`;
    request = request.or(
      [
        `first_name.ilike.${pattern}`,
        `last_name.ilike.${pattern}`,
        `email.ilike.${pattern}`,
        `phone.ilike.${pattern}`,
        `oib.ilike.${pattern}`,
      ].join(','),
    );
  }

  const { data, error, count } = await request;
  if (error) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  return {
    ok: true,
    data: {
      rows: (data ?? []) as ClientRecord[],
      total: count ?? 0,
    },
  };
}

export async function getClient(
  id: string,
): Promise<{ ok: true; record: ClientRecord } | { ok: false; error: string }> {
  const supabase = client();
  if (!supabase) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  const { data, error } = await supabase
    .from('clients')
    .select('id, first_name, last_name, email, phone, oib, created_at')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  return { ok: true, record: data as ClientRecord };
}

export async function createClient(
  input: ClientInput,
): Promise<ClientMutationResult> {
  const supabase = client();
  if (!supabase) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  const { data, error } = await supabase
    .from('clients')
    .insert(input)
    .select('id, first_name, last_name, email, phone, oib, created_at')
    .single();
  if (error || !data) {
    return mapWriteError(error);
  }
  return { ok: true, record: data as ClientRecord };
}

export async function updateClient(
  id: string,
  input: ClientInput,
): Promise<ClientMutationResult> {
  const supabase = client();
  if (!supabase) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  const { data, error } = await supabase
    .from('clients')
    .update(input)
    .eq('id', id)
    .select('id, first_name, last_name, email, phone, oib, created_at')
    .maybeSingle();
  if (error || !data) {
    return mapWriteError(error);
  }
  return { ok: true, record: data as ClientRecord };
}

export async function deleteClient(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = client();
  if (!supabase) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  return { ok: true };
}
