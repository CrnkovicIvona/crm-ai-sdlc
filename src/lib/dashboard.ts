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

const PAGE = 1000;

type QueryPage<T> = {
  data: T[] | null;
  error: { message?: string } | null;
};

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

export async function loadDashboardSnapshot(
  period: DatePeriod,
): Promise<
  { ok: true; snapshot: DashboardSnapshot } | { ok: false; error: string }
> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: GENERIC_CLIENT_ERROR };
  }
  // Same anon client and RLS as CRM-001. No service role.

  const clientsResult = await fetchAllPages<ClientStamp>((from, to) =>
    supabase
      .from('clients')
      .select('id, created_at, deleted_at')
      .range(from, to),
  );
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
