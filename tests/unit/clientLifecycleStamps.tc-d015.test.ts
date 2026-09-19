import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import {
  computeDashboard,
  type ClientStamp,
  resolvePeriod,
} from '../../src/lib/dashboardMetrics';
import { dashboardPublicTruth } from '../helpers/dashboardParity';

const adminId = '00000000-0000-4000-8000-00000000000a';
const viewerId = '00000000-0000-4000-8000-00000000000b';
const aliveId = '00000000-0000-4000-8000-000000000011';
const goneId = '00000000-0000-4000-8000-000000000012';

const migration = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../supabase/migrations/20260919193000_client_lifecycle_stamps.sql',
  ),
  'utf8',
);

const db = new PGlite();

async function exec(sql: string) {
  await db.exec(sql);
}

const viewSqlMatch = migration.match(/create or replace view[\s\S]*?;/i);
if (!viewSqlMatch) {
  throw new Error('client_lifecycle_stamps view SQL not found');
}
const viewSql = viewSqlMatch[0];

async function asUser<T>(userId: string, run: () => Promise<T>): Promise<T> {
  await exec(`select set_config('request.jwt.claim.sub', '${userId}', false)`);
  await exec('set role bankcrm_rls');
  try {
    return await run();
  } finally {
    await exec('reset role');
    await exec(`select set_config('request.jwt.claim.sub', '', false)`);
  }
}

async function stampsFor(userId: string): Promise<ClientStamp[]> {
  return asUser(userId, async () => {
    const result = await db.query<ClientStamp>(
      'select id::text, created_at::text, deleted_at::text from public.client_lifecycle_stamps order by id',
    );
    return result.rows;
  });
}

describe('TC-D015 client_lifecycle_stamps (PGlite)', () => {
  afterAll(async () => {
    await db.close();
  });

  it('TC-D015 VIEWER CRM list stays active-only while stamps match ADMIN New/Churned', async () => {
    await exec(`
      create schema if not exists auth;
      create or replace function auth.uid()
      returns uuid
      language sql
      stable
      as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
      $$;

      create table public.profiles (
        id uuid primary key,
        role text not null
      );

      create table public.clients (
        id uuid primary key,
        created_at timestamptz not null,
        deleted_at timestamptz
      );

      alter table public.clients enable row level security;
      alter table public.clients force row level security;

      create policy clients_select_authenticated
        on public.clients
        for select
        using (
          deleted_at is null
          and exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role in ('ADMIN', 'VIEWER')
          )
        );

      create policy clients_select_admin_deleted
        on public.clients
        for select
        using (
          deleted_at is not null
          and exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'ADMIN'
          )
        );

      insert into public.profiles (id, role) values
        ('${adminId}', 'ADMIN'),
        ('${viewerId}', 'VIEWER');

      insert into public.clients (id, created_at, deleted_at) values
        ('${aliveId}', '2026-09-01T00:00:00Z', null),
        ('${goneId}', '2026-09-02T00:00:00Z', '2026-09-10T00:00:00Z');

      create role bankcrm_rls nologin;
      grant usage on schema public to bankcrm_rls;
      grant select on public.clients, public.profiles to bankcrm_rls;
    `);
    await exec(viewSql);
    await exec('grant select on public.client_lifecycle_stamps to bankcrm_rls');

    const viewerClients = await asUser(viewerId, async () => {
      const result = await db.query<{ id: string }>(
        'select id::text from public.clients order by id',
      );
      return result.rows.map((row) => row.id);
    });
    expect(viewerClients).toEqual([aliveId]);

    const adminClients = await asUser(adminId, async () => {
      const result = await db.query<{ id: string }>(
        'select id::text from public.clients order by id',
      );
      return result.rows.map((row) => row.id);
    });
    expect(adminClients.sort()).toEqual([aliveId, goneId].sort());

    const adminStamps = await stampsFor(adminId);
    const viewerStamps = await stampsFor(viewerId);
    expect(viewerStamps.map((row) => row.id).sort()).toEqual(
      adminStamps.map((row) => row.id).sort(),
    );
    expect(
      viewerStamps.some((row) => row.id === goneId && row.deleted_at),
    ).toBe(true);

    const period = resolvePeriod(
      'last30',
      new Date('2026-09-19T12:00:00.000Z'),
    );
    const adminSnap = computeDashboard(adminStamps, [], [], period);
    const viewerSnap = computeDashboard(viewerStamps, [], [], period);
    expect(dashboardPublicTruth(viewerSnap)).toEqual(
      dashboardPublicTruth(adminSnap),
    );
    expect(viewerSnap.newClients).toBe(2);
    expect(viewerSnap.churnedClients).toBe(1);
    expect(viewerSnap.activeClients).toBe(1);
  });
});
