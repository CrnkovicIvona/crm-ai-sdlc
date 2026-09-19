import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const viewerEmail = process.env.E2E_VIEWER_EMAIL;
const viewerPassword = process.env.E2E_VIEWER_PASSWORD;

if (
  !url ||
  !serviceKey ||
  !adminEmail ||
  !adminPassword ||
  !viewerEmail ||
  !viewerPassword
) {
  console.error(
    'seed-local-auth: need VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, E2E_*',
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureUser(email, password, role) {
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  let userId = created.data.user?.id;
  if (created.error || !userId) {
    const listed = await admin.auth.admin.listUsers({ perPage: 200 });
    if (listed.error) {
      throw listed.error;
    }
    const existing = listed.data.users.find((user) => user.email === email);
    if (!existing) {
      throw created.error ?? new Error(`Could not create or find ${email}`);
    }
    userId = existing.id;
    const updated = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (updated.error) {
      throw updated.error;
    }
  }
  const profile = await admin.from('profiles').upsert({
    id: userId,
    role,
  });
  if (profile.error) {
    throw profile.error;
  }
}

await ensureUser(adminEmail, adminPassword, 'ADMIN');
await ensureUser(viewerEmail, viewerPassword, 'VIEWER');
console.log('seed-local-auth: ADMIN and VIEWER profiles ready');
