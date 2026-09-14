export type ClientStamp = {
  id: string;
  created_at: string;
  deleted_at: string | null;
};

export type ProductRow = {
  id: string;
  code: string;
  name: string;
};

export type AssignmentRow = {
  client_id: string;
  product_id: string;
};

export type DatePeriod = {
  start: Date;
  end: Date;
};

export type DatePreset = 'last7' | 'last30' | 'last90' | 'thisYear' | 'custom';

export const ACTIVE_CLIENTS_TOOLTIP =
  'Current number of clients that are not soft-deleted.';

export const CHURNED_CLIENTS_HINT =
  'Clients deactivated during the selected period.';

export type PercentValue = number | 'N/A';

function at(iso: string): number {
  return new Date(iso).getTime();
}

export function inHalfOpenRange(iso: string, period: DatePeriod): boolean {
  const t = at(iso);
  return t >= period.start.getTime() && t < period.end.getTime();
}

export function periodLastNDays(now: Date, days: number): DatePeriod {
  return {
    start: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
    end: now,
  };
}

export function periodThisYear(now: Date): DatePeriod {
  const year = now.getUTCFullYear();
  return {
    start: new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
    end: now,
  };
}

/** Custom calendar dates in UTC; endDate is inclusive calendar day. */
export function periodCustomUtc(
  startDate: string,
  endDate: string,
): DatePeriod {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const endDay = new Date(`${endDate}T00:00:00.000Z`);
  return {
    start,
    end: new Date(endDay.getTime() + 24 * 60 * 60 * 1000),
  };
}

export function resolvePeriod(
  preset: DatePreset,
  now: Date,
  customStart?: string,
  customEnd?: string,
): DatePeriod {
  if (preset === 'last7') {
    return periodLastNDays(now, 7);
  }
  if (preset === 'last30') {
    return periodLastNDays(now, 30);
  }
  if (preset === 'last90') {
    return periodLastNDays(now, 90);
  }
  if (preset === 'thisYear') {
    return periodThisYear(now);
  }
  if (!customStart || !customEnd) {
    return periodLastNDays(now, 30);
  }
  return periodCustomUtc(customStart, customEnd);
}

export function countActiveClients(clients: ClientStamp[]): number {
  return clients.filter((c) => c.deleted_at === null).length;
}

export function countNewClients(
  clients: ClientStamp[],
  period: DatePeriod,
): number {
  return clients.filter((c) => inHalfOpenRange(c.created_at, period)).length;
}

export function countChurnedClients(
  clients: ClientStamp[],
  period: DatePeriod,
): number {
  return clients.filter(
    (c) => c.deleted_at !== null && inHalfOpenRange(c.deleted_at, period),
  ).length;
}

export function countOpeningActiveBase(
  clients: ClientStamp[],
  period: DatePeriod,
): number {
  const startMs = period.start.getTime();
  return clients.filter((c) => {
    if (at(c.created_at) >= startMs) {
      return false;
    }
    return c.deleted_at === null || at(c.deleted_at) >= startMs;
  }).length;
}

export function churnRatePercent(
  churned: number,
  openingBase: number,
): PercentValue {
  if (openingBase === 0) {
    return 'N/A';
  }
  return (churned / openingBase) * 100;
}

export function netClientGrowth(newClients: number, churned: number): number {
  return newClients - churned;
}

export function activeClientIds(clients: ClientStamp[]): Set<string> {
  return new Set(clients.filter((c) => c.deleted_at === null).map((c) => c.id));
}

export function clientsWithProductsCount(
  activeIds: Set<string>,
  assignments: AssignmentRow[],
): number {
  const seen = new Set<string>();
  for (const row of assignments) {
    if (activeIds.has(row.client_id)) {
      seen.add(row.client_id);
    }
  }
  return seen.size;
}

export function productAdoptionPercent(
  withProducts: number,
  active: number,
): PercentValue {
  if (active === 0) {
    return 'N/A';
  }
  return (withProducts / active) * 100;
}

export type ProductDistributionRow = {
  productId: string;
  code: string;
  name: string;
  clients: number;
  percentOfActive: PercentValue;
};

export function clientsByProduct(
  products: ProductRow[],
  assignments: AssignmentRow[],
  activeIds: Set<string>,
  activeCount: number,
): ProductDistributionRow[] {
  const rows = products.map((product) => {
    const distinct = new Set<string>();
    for (const row of assignments) {
      if (row.product_id === product.id && activeIds.has(row.client_id)) {
        distinct.add(row.client_id);
      }
    }
    const clients = distinct.size;
    return {
      productId: product.id,
      code: product.code,
      name: product.name,
      clients,
      percentOfActive:
        activeCount === 0 ? ('N/A' as const) : (clients / activeCount) * 100,
    };
  });
  rows.sort((a, b) => b.clients - a.clients || a.name.localeCompare(b.name));
  return rows;
}

function startOfUtcMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function addUtcMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
}

function minDate(a: Date, b: Date): Date {
  return a.getTime() <= b.getTime() ? a : b;
}

function maxDate(a: Date, b: Date): Date {
  return a.getTime() >= b.getTime() ? a : b;
}

export type MonthlyPoint = {
  label: string;
  portionEnd: Date;
  activeStock: number;
  newClients: number;
  churnedClients: number;
};

function stockAt(clients: ClientStamp[], instantExclusive: Date): number {
  const t = instantExclusive.getTime();
  return clients.filter((c) => {
    if (at(c.created_at) >= t) {
      return false;
    }
    return c.deleted_at === null || at(c.deleted_at) >= t;
  }).length;
}

export function monthlySeries(
  clients: ClientStamp[],
  period: DatePeriod,
): MonthlyPoint[] {
  if (period.end.getTime() <= period.start.getTime()) {
    return [];
  }
  const lastInstant = new Date(period.end.getTime() - 1);
  const points: MonthlyPoint[] = [];
  let cursor = startOfUtcMonth(period.start);
  while (cursor.getTime() <= lastInstant.getTime()) {
    const monthEnd = addUtcMonth(cursor);
    const portionEnd = minDate(monthEnd, period.end);
    const eventStart = maxDate(cursor, period.start);
    const eventEnd = minDate(monthEnd, period.end);
    const eventPeriod: DatePeriod = { start: eventStart, end: eventEnd };
    const y = cursor.getUTCFullYear();
    const m = String(cursor.getUTCMonth() + 1).padStart(2, '0');
    points.push({
      label: `${y}-${m}`,
      portionEnd,
      activeStock: stockAt(clients, portionEnd),
      newClients: countNewClients(clients, eventPeriod),
      churnedClients: countChurnedClients(clients, eventPeriod),
    });
    cursor = monthEnd;
  }
  return points;
}

export function formatPercent(value: PercentValue): string {
  if (value === 'N/A') {
    return 'N/A';
  }
  if (Number.isInteger(value)) {
    return `${value}%`;
  }
  return `${value.toFixed(1)}%`;
}

export function formatNetGrowth(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }
  return String(value);
}

export type DashboardSnapshot = {
  period: DatePeriod;
  activeClients: number;
  newClients: number;
  churnedClients: number;
  openingBase: number;
  churnRate: PercentValue;
  netGrowth: number;
  productAdoption: PercentValue;
  clientsWithProducts: number;
  byProduct: ProductDistributionRow[];
  monthly: MonthlyPoint[];
};

export function computeDashboard(
  clients: ClientStamp[],
  products: ProductRow[],
  assignments: AssignmentRow[],
  period: DatePeriod,
): DashboardSnapshot {
  const active = countActiveClients(clients);
  const created = countNewClients(clients, period);
  const churned = countChurnedClients(clients, period);
  const opening = countOpeningActiveBase(clients, period);
  const ids = activeClientIds(clients);
  const withProducts = clientsWithProductsCount(ids, assignments);
  return {
    period,
    activeClients: active,
    newClients: created,
    churnedClients: churned,
    openingBase: opening,
    churnRate: churnRatePercent(churned, opening),
    netGrowth: netClientGrowth(created, churned),
    productAdoption: productAdoptionPercent(withProducts, active),
    clientsWithProducts: withProducts,
    byProduct: clientsByProduct(products, assignments, ids, active),
    monthly: monthlySeries(clients, period),
  };
}
