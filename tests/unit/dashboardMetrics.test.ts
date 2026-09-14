import { describe, expect, it } from 'vitest';
import {
  ACTIVE_CLIENTS_TOOLTIP,
  type AssignmentRow,
  type ClientStamp,
  type ProductRow,
  computeDashboard,
  countActiveClients,
  countChurnedClients,
  countNewClients,
  countOpeningActiveBase,
  formatNetGrowth,
  formatPercent,
  productAdoptionPercent,
  resolvePeriod,
} from '../../src/lib/dashboardMetrics';

function stamp(
  id: string,
  created: string,
  deleted: string | null = null,
): ClientStamp {
  return { id, created_at: created, deleted_at: deleted };
}

const MARCH: { start: Date; end: Date } = {
  start: new Date('2026-03-01T00:00:00.000Z'),
  end: new Date('2026-04-01T00:00:00.000Z'),
};

describe('DASH-001 dashboard metrics', () => {
  it('TC-D003 Active Clients is current non-deleted stock and ignores the date range', () => {
    const clients = [
      stamp('a1', '2025-01-01T00:00:00.000Z'),
      stamp('a2', '2025-02-01T00:00:00.000Z'),
      stamp('a3', '2025-03-01T00:00:00.000Z'),
      stamp('a4', '2026-03-10T00:00:00.000Z'),
      stamp('a5', '2026-03-20T00:00:00.000Z'),
      stamp('a6', '2026-04-02T00:00:00.000Z'),
      stamp('a7', '2026-05-01T00:00:00.000Z'),
      stamp('a8', '2026-06-01T00:00:00.000Z'),
      stamp('d1', '2025-01-01T00:00:00.000Z', '2026-03-15T00:00:00.000Z'),
      stamp('d2', '2026-02-01T00:00:00.000Z', '2026-05-01T00:00:00.000Z'),
    ];
    expect(countActiveClients(clients)).toBe(8);
    const march = computeDashboard(clients, [], [], MARCH);
    const later = computeDashboard(clients, [], [], {
      start: new Date('2026-08-01T00:00:00.000Z'),
      end: new Date('2026-09-01T00:00:00.000Z'),
    });
    expect(march.activeClients).toBe(8);
    expect(later.activeClients).toBe(8);
    expect(ACTIVE_CLIENTS_TOOLTIP).toBe(
      'Current number of clients that are not soft-deleted.',
    );
  });

  it('TC-D004 New Clients counts created_at in range including created-then-deleted', () => {
    const clients = [
      stamp('before', '2026-02-15T00:00:00.000Z'),
      stamp('in-range', '2026-03-10T12:00:00.000Z'),
      stamp(
        'in-then-deleted',
        '2026-03-12T00:00:00.000Z',
        '2026-03-20T00:00:00.000Z',
      ),
      stamp('on-end', '2026-04-01T00:00:00.000Z'),
      stamp('after', '2026-04-02T00:00:00.000Z'),
    ];
    expect(countNewClients(clients, MARCH)).toBe(2);
  });

  it('TC-D005 Churned Clients counts only deleted_at in [start, end)', () => {
    const clients = [
      stamp('before', '2025-01-01T00:00:00.000Z', '2026-02-20T00:00:00.000Z'),
      stamp('in-range', '2025-01-01T00:00:00.000Z', '2026-03-15T00:00:00.000Z'),
      stamp('on-end', '2025-01-01T00:00:00.000Z', '2026-04-01T00:00:00.000Z'),
      stamp('after', '2025-01-01T00:00:00.000Z', '2026-04-02T00:00:00.000Z'),
      stamp('active', '2025-01-01T00:00:00.000Z'),
    ];
    expect(countChurnedClients(clients, MARCH)).toBe(1);
  });

  it('TC-D006 Churn Rate is 5% when opening base is 100 and churned is 5', () => {
    const clients: ClientStamp[] = [];
    for (let i = 0; i < 100; i += 1) {
      clients.push(
        stamp(
          `o${i}`,
          '2026-01-01T00:00:00.000Z',
          i < 5 ? '2026-03-10T00:00:00.000Z' : null,
        ),
      );
    }
    expect(countOpeningActiveBase(clients, MARCH)).toBe(100);
    expect(countChurnedClients(clients, MARCH)).toBe(5);
    const snap = computeDashboard(clients, [], [], MARCH);
    expect(snap.churnRate).toBe(5);
    expect(formatPercent(snap.churnRate)).toBe('5%');
  });

  it('TC-D007a opening 0 and churned 0 yields N/A churn rate', () => {
    const clients = [stamp('new', '2026-03-10T00:00:00.000Z')];
    const snap = computeDashboard(clients, [], [], MARCH);
    expect(snap.openingBase).toBe(0);
    expect(snap.churnedClients).toBe(0);
    expect(snap.churnRate).toBe('N/A');
    expect(formatPercent(snap.churnRate)).toBe('N/A');
  });

  it('TC-D007b opening 0 and churned > 0 yields N/A churn rate', () => {
    const clients = [
      stamp(
        'born-and-gone',
        '2026-03-05T00:00:00.000Z',
        '2026-03-20T00:00:00.000Z',
      ),
    ];
    const snap = computeDashboard(clients, [], [], MARCH);
    expect(snap.openingBase).toBe(0);
    expect(snap.churnedClients).toBe(1);
    expect(snap.churnRate).toBe('N/A');
    expect(formatPercent(snap.churnRate)).toBe('N/A');
  });

  it('TC-D008 Net Client Growth is New minus Churned (+14)', () => {
    const clients: ClientStamp[] = [];
    for (let i = 0; i < 18; i += 1) {
      clients.push(stamp(`n${i}`, '2026-03-08T00:00:00.000Z'));
    }
    for (let i = 0; i < 4; i += 1) {
      clients.push(
        stamp(`c${i}`, '2025-01-01T00:00:00.000Z', '2026-03-12T00:00:00.000Z'),
      );
    }
    const snap = computeDashboard(clients, [], [], MARCH);
    expect(snap.newClients).toBe(18);
    expect(snap.churnedClients).toBe(4);
    expect(snap.netGrowth).toBe(14);
    expect(formatNetGrowth(snap.netGrowth)).toBe('+14');
  });

  it('TC-D009 Last 30 days maps New and Churned to the period and leaves Active as current stock', () => {
    const now = new Date('2026-09-14T12:00:00.000Z');
    const period = resolvePeriod('last30', now);
    expect(period.end.getTime()).toBe(now.getTime());
    expect(period.start.getTime()).toBe(
      now.getTime() - 30 * 24 * 60 * 60 * 1000,
    );
    const clients = [
      stamp('new', '2026-09-01T00:00:00.000Z'),
      stamp('old-active', '2026-07-01T00:00:00.000Z'),
      stamp('churned', '2026-01-01T00:00:00.000Z', '2026-09-10T00:00:00.000Z'),
      stamp(
        'old-churn',
        '2026-01-01T00:00:00.000Z',
        '2026-01-15T00:00:00.000Z',
      ),
    ];
    const last30 = computeDashboard(clients, [], [], period);
    const last7 = computeDashboard(
      clients,
      [],
      [],
      resolvePeriod('last7', now),
    );
    expect(last30.newClients).toBe(1);
    expect(last30.churnedClients).toBe(1);
    expect(last30.activeClients).toBe(2);
    expect(last7.activeClients).toBe(last30.activeClients);
    expect(last7.newClients).toBe(0);
  });

  it('TC-D010 Product Adoption Rate is 60% for 60 of 100 active clients with a product', () => {
    const clients: ClientStamp[] = [];
    const assignments: AssignmentRow[] = [];
    for (let i = 0; i < 100; i += 1) {
      clients.push(stamp(`a${i}`, '2025-01-01T00:00:00.000Z'));
      if (i < 60) {
        assignments.push({ client_id: `a${i}`, product_id: 'p1' });
        if (i < 10) {
          assignments.push({ client_id: `a${i}`, product_id: 'p2' });
        }
      }
    }
    const products: ProductRow[] = [
      { id: 'p1', code: 'bank_account', name: 'Bank account' },
      { id: 'p2', code: 'loan', name: 'Loan' },
    ];
    const snap = computeDashboard(clients, products, assignments, MARCH);
    expect(snap.activeClients).toBe(100);
    expect(snap.clientsWithProducts).toBe(60);
    expect(snap.productAdoption).toBe(60);
    expect(formatPercent(snap.productAdoption)).toBe('60%');
  });

  it('TC-D011 one client with three products counts once on each product', () => {
    const clients = [stamp('c1', '2025-01-01T00:00:00.000Z')];
    const products: ProductRow[] = [
      { id: 'p1', code: 'a', name: 'A' },
      { id: 'p2', code: 'b', name: 'B' },
      { id: 'p3', code: 'c', name: 'C' },
    ];
    const assignments: AssignmentRow[] = [
      { client_id: 'c1', product_id: 'p1' },
      { client_id: 'c1', product_id: 'p2' },
      { client_id: 'c1', product_id: 'p3' },
    ];
    const snap = computeDashboard(clients, products, assignments, MARCH);
    expect(snap.clientsWithProducts).toBe(1);
    expect(snap.byProduct.map((row) => row.clients)).toEqual([1, 1, 1]);
  });

  it('TC-D012 deleted clients are excluded from adoption and by-product counts', () => {
    const clients = [
      stamp('alive', '2025-01-01T00:00:00.000Z'),
      stamp('gone', '2025-01-01T00:00:00.000Z', '2026-03-02T00:00:00.000Z'),
    ];
    const products: ProductRow[] = [
      { id: 'p1', code: 'a', name: 'A' },
      { id: 'p2', code: 'b', name: 'B' },
    ];
    const assignments: AssignmentRow[] = [
      { client_id: 'gone', product_id: 'p1' },
      { client_id: 'gone', product_id: 'p2' },
    ];
    const snap = computeDashboard(clients, products, assignments, MARCH);
    expect(snap.activeClients).toBe(1);
    expect(snap.clientsWithProducts).toBe(0);
    expect(snap.productAdoption).toBe(0);
    expect(snap.byProduct.map((row) => row.clients)).toEqual([0, 0]);
  });

  it('TC-D013 zero active clients yields N/A percentages without NaN or Infinity', () => {
    const snap = computeDashboard([], [], [], MARCH);
    expect(snap.activeClients).toBe(0);
    expect(snap.productAdoption).toBe('N/A');
    expect(productAdoptionPercent(0, 0)).toBe('N/A');
    expect(formatPercent(snap.productAdoption)).toBe('N/A');
    expect(formatPercent(snap.churnRate)).toBe('N/A');
    expect(Number.isNaN(snap.activeClients)).toBe(false);
    expect(Number.isFinite(snap.netGrowth)).toBe(true);
    for (const point of snap.monthly) {
      expect(Number.isNaN(point.activeStock)).toBe(false);
      expect(Number.isFinite(point.activeStock)).toBe(true);
    }
  });
});
