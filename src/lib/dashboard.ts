import { GENERIC_CLIENT_ERROR } from './clientValidation';
import {
  computeDashboard,
  type AssignmentRow,
  type ClientStamp,
  type DashboardSnapshot,
  type DatePeriod,
  type ProductRow,
} from './dashboardMetrics';
import { getSupabase } from './supabase';

export const CLIENT_LIFECYCLE_STAMPS = 'client_lifecycle_stamps';

const PAGE = 1000;

type QueryPage<T> = {
  data: T[] | null;
  error: { code?: string; message?: string } | null;
};

function isMissingRelation(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!error) {
    return false;
  }
  const code = error.code ?? '';
  const message = (error.message ?? '').toLowerCase();
  return (
    code === 'PGRST205' ||
    code === '42P01' ||
    (message.includes('client_lifecycle_stamps') &&
      (message.includes('schema cache') ||
        message.includes('does not exist') ||
        message.includes('not find')))
  );
}

async function fetchAllPages<T>(
  run: (from: number, to: number) => PromiseLike<QueryPage<T>>,
): Promise<{ ok: true; rows: T[] } | { ok: false; error: string }> {
  const rows: T[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await run(from, from + PAGE - 1);
    if (error) {
      return { ok: false, error: GENERIC_CLIENT_ERROR };
    }
    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < PAGE) {
      return { ok: true, rows };
    }
    from += PAGE;
  }
}

export async function loadClientStamps(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
): Promise<{ ok: true; rows: ClientStamp[] } | { ok: false; error: string }> {
  const probe = await supabase
    .from(CLIENT_LIFECYCLE_STAMPS)
    .select('id')
    .limit(1);
  if (probe.error && isMissingRelation(probe.error)) {
    // View not on this database yet. CRM RLS fallback (VIEWER incomplete).
    return fetchAllPages<ClientStamp>((from, to) =>
      supabase
        .from('clients')
        .select('id, created_at, deleted_at')
        .range(from, to),
    );
  }
  if (probe.error) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  return fetchAllPages<ClientStamp>((from, to) =>
    supabase
      .from(CLIENT_LIFECYCLE_STAMPS)
      .select('id, created_at, deleted_at')
      .range(from, to),
  );
}

export async function loadDashboardSnapshot(
  period: DatePeriod,
): Promise<
  { ok: true; snapshot: DashboardSnapshot } | { ok: false; error: string }
> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  // Stamps view (TD-D005). No service role. No PII columns.

  const clientsResult = await loadClientStamps(supabase);
  if (!clientsResult.ok) {
    return clientsResult;
  }

  const productsResult = await fetchAllPages<ProductRow>((from, to) =>
    supabase.from('products').select('id, code, name').range(from, to),
  );
  if (!productsResult.ok) {
    return productsResult;
  }

  const assignmentsResult = await fetchAllPages<AssignmentRow>((from, to) =>
    supabase
      .from('client_products')
      .select('client_id, product_id')
      .range(from, to),
  );
  if (!assignmentsResult.ok) {
    return assignmentsResult;
  }

  return {
    ok: true,
    snapshot: computeDashboard(
      clientsResult.rows,
      productsResult.rows,
      assignmentsResult.rows,
      period,
    ),
  };
}
