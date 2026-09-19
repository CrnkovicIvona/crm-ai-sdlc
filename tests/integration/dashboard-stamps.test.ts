import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { afterAll, describe, expect, it } from 'vitest';
import { CLIENT_LIFECYCLE_STAMPS } from '../../src/lib/dashboard';
import {
  computeDashboard,
  type ClientStamp,
  resolvePeriod,
} from '../../src/lib/dashboardMetrics';

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const viewerEmail = process.env.E2E_VIEWER_EMAIL;
const viewerPassword = process.env.E2E_VIEWER_PASSWORD;

const live =
  Boolean(url) &&
  Boolean(anonKey) &&
  Boolean(serviceKey) &&
  Boolean(adminEmail) &&
  Boolean(adminPassword) &&
  Boolean(viewerEmail) &&
  Boolean(viewerPassword);

const createdIds: string[] = [];

function uniqueClient() {
  const stamp = `${Date.now()}${Math.floor(Math.random() * 1_000_000)}`.slice(
    -11,
  );
  return {
    first_name: 'Dashqa',
    last_name: `Stamp${stamp.slice(0, 6)}`,
    email: `dash004.${stamp}@bank.example`,
    phone: '12345678',
    oib: stamp.padStart(11, '0').slice(0, 11),
  };
}

async function signIn(
  email: string,
  password: string,
): Promise<SupabaseClient> {
  const supabase = createClient(url!, anonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  return supabase;
}

async function fetchStamps(client: SupabaseClient): Promise<ClientStamp[]> {
  const { data, error } = await client
    .from(CLIENT_LIFECYCLE_STAMPS)
    .select('id, created_at, deleted_at');
  if (error) {
    throw error;
  }
  return (data ?? []) as ClientStamp[];
}

describe.skipIf(!live)(
  'dashboard stamps RLS (TC-D015)',
  { timeout: 45_000 },
  () => {
    afterAll(async () => {
      if (!live || createdIds.length === 0) {
        return;
      }
      const admin = createClient(url!, serviceKey!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      await admin.from('clients').delete().in('id', createdIds);
    });

    it('TC-D015 VIEWER and ADMIN see the same stamp-backed New and Churned', async ({
      skip,
    }) => {
      const admin = await signIn(adminEmail!, adminPassword!);
      const probe = await admin
        .from(CLIENT_LIFECYCLE_STAMPS)
        .select('id')
        .limit(1);
      if (probe.error) {
        const message = `client_lifecycle_stamps missing (${probe.error.message})`;
        if (process.env.TC_D015_REQUIRE_VIEW === '1') {
          throw new Error(`TC-D015 FAILED: ${message}`);
        }
        skip(`TC-D015 SKIPPED (not PASSED): ${message}`);
        return;
      }

      const payload = uniqueClient();
      const created = await admin
        .from('clients')
        .insert(payload)
        .select('id')
        .single();
      expect(created.error).toBeNull();
      const id = created.data!.id;
      createdIds.push(id);

      const soft = await admin
        .from('clients')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select('id, deleted_at')
        .single();
      expect(soft.error).toBeNull();
      expect(soft.data?.deleted_at).toBeTruthy();

      const viewer = await signIn(viewerEmail!, viewerPassword!);
      const viewerRow = await viewer
        .from('clients')
        .select('id')
        .eq('id', id)
        .maybeSingle();
      expect(viewerRow.data).toBeNull();

      const viewerStamp = await viewer
        .from(CLIENT_LIFECYCLE_STAMPS)
        .select('id, deleted_at')
        .eq('id', id)
        .maybeSingle();
      expect(viewerStamp.error).toBeNull();
      expect(viewerStamp.data?.id).toBe(id);
      expect(viewerStamp.data?.deleted_at).toBeTruthy();

      const period = resolvePeriod('last30', new Date());
      const adminSnap = computeDashboard(
        await fetchStamps(admin),
        [],
        [],
        period,
      );
      const viewerSnap = computeDashboard(
        await fetchStamps(viewer),
        [],
        [],
        period,
      );
      expect(viewerSnap.newClients).toBe(adminSnap.newClients);
      expect(viewerSnap.churnedClients).toBe(adminSnap.churnedClients);
      expect(viewerSnap.activeClients).toBe(adminSnap.activeClients);
    });
  },
);
