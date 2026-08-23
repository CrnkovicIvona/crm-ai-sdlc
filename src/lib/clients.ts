import { getSupabase } from './supabase';
import {
  GENERIC_CLIENT_ERROR,
  isUniqueEmailViolation,
  type ClientInput,
  type FieldErrors,
} from './clientValidation';
import type { ProductRecord } from './products';

export const CLIENT_PAGE_SIZE = 20;

export type ClientRecord = ClientInput & {
  id: string;
  created_at: string;
  products: ProductRecord[];
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

async function loadProductsForClients(
  clientIds: string[],
): Promise<Map<string, ProductRecord[]>> {
  const map = new Map<string, ProductRecord[]>();
  if (clientIds.length === 0) {
    return map;
  }
  const supabase = client();
  if (!supabase) {
    return map;
  }
  const { data, error } = await supabase
    .from('client_products')
    .select('client_id, products(id, code, name)')
    .in('client_id', clientIds);
  if (error || !data) {
    return map;
  }
  for (const row of data as Array<{
    client_id: string;
    products: ProductRecord | ProductRecord[] | null;
  }>) {
    const product = Array.isArray(row.products)
      ? row.products[0]
      : row.products;
    if (!product) {
      continue;
    }
    const current = map.get(row.client_id) ?? [];
    current.push(product);
    map.set(row.client_id, current);
  }
  return map;
}

export async function listProducts(): Promise<
  { ok: true; products: ProductRecord[] } | { ok: false; error: string }
> {
  const supabase = client();
  if (!supabase) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  const { data, error } = await supabase
    .from('products')
    .select('id, code, name')
    .order('name', { ascending: true });
  if (error) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  return { ok: true, products: (data ?? []) as ProductRecord[] };
}

export async function setClientProducts(
  clientId: string,
  productIds: string[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = client();
  if (!supabase) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  const { error: deleteError } = await supabase
    .from('client_products')
    .delete()
    .eq('client_id', clientId);
  if (deleteError) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  const uniqueIds = [...new Set(productIds)];
  if (uniqueIds.length === 0) {
    return { ok: true };
  }
  const { error: insertError } = await supabase.from('client_products').insert(
    uniqueIds.map((product_id) => ({
      client_id: clientId,
      product_id,
    })),
  );
  if (insertError) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  return { ok: true };
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
    .is('deleted_at', null)
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
  const rows = (data ?? []) as Omit<ClientRecord, 'products'>[];
  const productsByClient = await loadProductsForClients(
    rows.map((row) => row.id),
  );
  return {
    ok: true,
    data: {
      rows: rows.map((row) => ({
        ...row,
        products: productsByClient.get(row.id) ?? [],
      })),
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
    .is('deleted_at', null)
    .maybeSingle();
  if (error || !data) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  const productsByClient = await loadProductsForClients([id]);
  return {
    ok: true,
    record: {
      ...(data as Omit<ClientRecord, 'products'>),
      products: productsByClient.get(id) ?? [],
    },
  };
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
  return {
    ok: true,
    record: { ...(data as Omit<ClientRecord, 'products'>), products: [] },
  };
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
  return {
    ok: true,
    record: { ...(data as Omit<ClientRecord, 'products'>), products: [] },
  };
}

export async function deleteClient(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = client();
  if (!supabase) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('clients')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: userData.user?.id ?? null,
    })
    .eq('id', id)
    .is('deleted_at', null)
    .select('id')
    .maybeSingle();
  if (error || !data) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  return { ok: true };
}
