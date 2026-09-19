import { describe, expect, it } from 'vitest';
import {
  CLIENT_LIFECYCLE_STAMPS,
  loadClientStamps,
} from '../../src/lib/dashboard';
import type { ClientStamp } from '../../src/lib/dashboardMetrics';

const ALIVE: ClientStamp = {
  id: 'alive',
  created_at: '2026-03-10T00:00:00.000Z',
  deleted_at: null,
};
const GONE: ClientStamp = {
  id: 'gone',
  created_at: '2026-03-05T00:00:00.000Z',
  deleted_at: '2026-03-20T00:00:00.000Z',
};

type QueryPage = {
  data: ClientStamp[] | { id: string }[] | null;
  error: { code?: string; message?: string } | null;
};

function fakeSupabase(tables: {
  stamps?: ClientStamp[] | QueryPage;
  clients: ClientStamp[];
}) {
  return {
    from(name: string) {
      const missingStamps: QueryPage = {
        data: null,
        error: {
          code: 'PGRST205',
          message: `Could not find the table 'public.${CLIENT_LIFECYCLE_STAMPS}' in the schema cache`,
        },
      };
      const source: QueryPage =
        name === CLIENT_LIFECYCLE_STAMPS
          ? Array.isArray(tables.stamps)
            ? { data: tables.stamps, error: null }
            : (tables.stamps ?? missingStamps)
          : { data: tables.clients, error: null };
      return {
        select() {
          return {
            limit: async (): Promise<QueryPage> => source,
            range: async (from: number, to: number): Promise<QueryPage> => {
              if (source.error) {
                return source;
              }
              const rows = (source.data ?? []) as ClientStamp[];
              return { data: rows.slice(from, to + 1), error: null };
            },
          };
        },
      };
    },
  };
}

describe('dashboard stamp loader (BUG-004)', () => {
  it('TC-D015-loader VIEWER-shaped clients plus stamps yield the full lifecycle set', async () => {
    const viewerClients = [ALIVE];
    const stamps = [ALIVE, GONE];
    const result = await loadClientStamps(
      fakeSupabase({ stamps, clients: viewerClients }) as never,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.rows.map((row) => row.id).sort()).toEqual(['alive', 'gone']);
  });

  it('missing stamps view falls back to clients (VIEWER-incomplete until apply-schema)', async () => {
    const viewerClients = [ALIVE];
    const result = await loadClientStamps(
      fakeSupabase({ clients: viewerClients }) as never,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.rows.map((row) => row.id)).toEqual(['alive']);
  });
});
