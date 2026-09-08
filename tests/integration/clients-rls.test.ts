import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { afterAll, describe, expect, it } from 'vitest';

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
    first_name: 'Crmone',
    last_name: `Audit${stamp.slice(0, 6)}`,
    email: `crm001.${stamp}@bank.example`,
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

describe.skipIf(!live)(
  'clients RLS and audit (TC-C012–C019)',
  { timeout: 20_000 },
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

    it('TC-C012 VIEWER insert/update/delete is denied by RLS', async () => {
      const viewer = await signIn(viewerEmail!, viewerPassword!);
      const payload = uniqueClient();
      const inserted = await viewer
        .from('clients')
        .insert(payload)
        .select('id');
      expect(inserted.data).toBeNull();
      expect(inserted.error).toBeTruthy();

      const admin = await signIn(adminEmail!, adminPassword!);
      const created = await admin
        .from('clients')
        .insert(payload)
        .select('id')
        .single();
      expect(created.error).toBeNull();
      createdIds.push(created.data!.id);

      const updated = await viewer
        .from('clients')
        .update({ first_name: 'Nope' })
        .eq('id', created.data!.id)
        .select('id');
      expect(updated.error ?? updated.data?.length === 0).toBeTruthy();
      if (!updated.error) {
        expect(updated.data ?? []).toHaveLength(0);
      }

      const deleted = await viewer
        .from('clients')
        .delete()
        .eq('id', created.data!.id)
        .select('id');
      expect(deleted.error ?? deleted.data?.length === 0).toBeTruthy();
      if (!deleted.error) {
        expect(deleted.data ?? []).toHaveLength(0);
      }

      const stillThere = await admin
        .from('clients')
        .select('id')
        .eq('id', created.data!.id)
        .maybeSingle();
      expect(stillThere.data?.id).toBe(created.data!.id);
    });

    it('TC-C013–C016 ADMIN CUD writes audit rows with required attributes', async () => {
      const admin = await signIn(adminEmail!, adminPassword!);
      const service = createClient(url!, serviceKey!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const payload = uniqueClient();
      const created = await admin
        .from('clients')
        .insert(payload)
        .select('id, first_name')
        .single();
      expect(created.error).toBeNull();
      const id = created.data!.id;
      createdIds.push(id);

      const { data: session } = await admin.auth.getUser();
      const actor = session.user?.id;
      expect(actor).toBeTruthy();

      const afterCreate = await service
        .from('client_audit_events')
        .select(
          'actor_id, action, entity, entity_id, occurred_at, previous_value, new_value',
        )
        .eq('entity_id', id)
        .eq('action', 'CREATE')
        .maybeSingle();
      expect(afterCreate.error).toBeNull();
      expect(afterCreate.data?.actor_id).toBe(actor);
      expect(afterCreate.data?.entity).toBe('Client');
      expect(afterCreate.data?.entity_id).toBe(id);
      expect(afterCreate.data?.occurred_at).toBeTruthy();
      expect(afterCreate.data?.previous_value).toBeNull();
      expect(afterCreate.data?.new_value).toMatchObject({
        id,
        first_name: payload.first_name,
        email: payload.email,
      });

      const updated = await admin
        .from('clients')
        .update({ first_name: 'Updated' })
        .eq('id', id)
        .select('id')
        .single();
      expect(updated.error).toBeNull();

      const afterUpdate = await service
        .from('client_audit_events')
        .select('previous_value, new_value, action')
        .eq('entity_id', id)
        .eq('action', 'UPDATE')
        .maybeSingle();
      expect(afterUpdate.data?.previous_value).toMatchObject({
        first_name: payload.first_name,
      });
      expect(afterUpdate.data?.new_value).toMatchObject({
        first_name: 'Updated',
      });

      const deleted = await admin
        .from('clients')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select('id')
        .maybeSingle();
      expect(deleted.error).toBeNull();

      const afterDelete = await service
        .from('client_audit_events')
        .select('previous_value, new_value, action')
        .eq('entity_id', id)
        .eq('action', 'DELETE')
        .maybeSingle();
      expect(afterDelete.data?.new_value).toBeNull();
      expect(afterDelete.data?.previous_value).toMatchObject({ id });
    });

    it('TC-C017 authenticated users cannot update or delete audit rows', async () => {
      const admin = await signIn(adminEmail!, adminPassword!);
      const service = createClient(url!, serviceKey!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const payload = uniqueClient();
      const created = await admin
        .from('clients')
        .insert(payload)
        .select('id')
        .single();
      expect(created.error).toBeNull();
      createdIds.push(created.data!.id);

      const audit = await service
        .from('client_audit_events')
        .select('id')
        .eq('entity_id', created.data!.id)
        .eq('action', 'CREATE')
        .single();
      expect(audit.data?.id).toBeTruthy();

      const patched = await admin
        .from('client_audit_events')
        .update({ action: 'DELETE' })
        .eq('id', audit.data!.id)
        .select('id');
      expect(patched.error ?? patched.data?.length === 0).toBeTruthy();

      const removed = await admin
        .from('client_audit_events')
        .delete()
        .eq('id', audit.data!.id)
        .select('id');
      expect(removed.error ?? removed.data?.length === 0).toBeTruthy();

      const still = await service
        .from('client_audit_events')
        .select('id, action')
        .eq('id', audit.data!.id)
        .maybeSingle();
      expect(still.data?.action).toBe('CREATE');
    });

    it('TC-C018 READ does not insert an audit row', async () => {
      const admin = await signIn(adminEmail!, adminPassword!);
      const service = createClient(url!, serviceKey!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const payload = uniqueClient();
      const created = await admin
        .from('clients')
        .insert(payload)
        .select('id')
        .single();
      expect(created.error).toBeNull();
      createdIds.push(created.data!.id);

      const before = await service
        .from('client_audit_events')
        .select('id', { count: 'exact', head: true })
        .eq('entity_id', created.data!.id);

      await admin.from('clients').select('*').eq('id', created.data!.id);

      const after = await service
        .from('client_audit_events')
        .select('id', { count: 'exact', head: true })
        .eq('entity_id', created.data!.id);
      expect(after.count).toBe(before.count);
    });

    it('TC-C019 failed VIEWER write does not insert audit', async () => {
      const viewer = await signIn(viewerEmail!, viewerPassword!);
      const service = createClient(url!, serviceKey!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const payload = uniqueClient();
      const before = await service
        .from('client_audit_events')
        .select('id', { count: 'exact', head: true })
        .eq('new_value->>email', payload.email);

      const inserted = await viewer.from('clients').insert(payload);
      expect(inserted.error).toBeTruthy();

      const after = await service
        .from('client_audit_events')
        .select('id', { count: 'exact', head: true })
        .eq('new_value->>email', payload.email);
      expect(after.count ?? 0).toBe(before.count ?? 0);
    });

    it('ADMIN may assign catalog products; VIEWER may not write client_products', async () => {
      const admin = await signIn(adminEmail!, adminPassword!);
      const viewer = await signIn(viewerEmail!, viewerPassword!);
      const payload = uniqueClient();
      const created = await admin
        .from('clients')
        .insert(payload)
        .select('id')
        .single();
      expect(created.error).toBeNull();
      createdIds.push(created.data!.id);

      const catalog = await admin.from('products').select('id, code');
      expect(catalog.error).toBeNull();
      expect((catalog.data ?? []).length).toBeGreaterThanOrEqual(6);
      const productId = catalog.data![0].id;

      const assigned = await admin.from('client_products').insert({
        client_id: created.data!.id,
        product_id: productId,
      });
      expect(assigned.error).toBeNull();

      const viewerWrite = await viewer.from('client_products').insert({
        client_id: created.data!.id,
        product_id: catalog.data![1]?.id ?? productId,
      });
      expect(viewerWrite.error).toBeTruthy();

      const viewerRead = await viewer
        .from('client_products')
        .select('product_id')
        .eq('client_id', created.data!.id);
      expect(viewerRead.error).toBeNull();
      expect((viewerRead.data ?? []).length).toBeGreaterThan(0);
    });
  },
);
