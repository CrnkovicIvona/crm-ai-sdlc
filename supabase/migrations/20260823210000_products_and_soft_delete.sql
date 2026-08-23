-- CRM-001 product catalog, client assignments, and soft-delete.
-- Apply to non-production only. Do not run against production from the agent.

alter table public.clients
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  created_at timestamptz not null default now()
);

insert into public.products (code, name)
values
  ('bank_account', 'Bank account'),
  ('credit_card', 'Credit card'),
  ('loan', 'Loan'),
  ('savings', 'Savings'),
  ('mobile_banking', 'Mobile banking'),
  ('online_banking', 'Online banking')
on conflict (code) do nothing;

create table if not exists public.client_products (
  client_id uuid not null references public.clients (id) on delete cascade,
  product_id uuid not null references public.products (id),
  created_at timestamptz not null default now(),
  primary key (client_id, product_id)
);

drop index if exists public.clients_email_lower_key;
create unique index clients_email_lower_key
  on public.clients (lower(email))
  where deleted_at is null;

create or replace function public.clients_row_payload(p_row public.clients)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'id', p_row.id,
    'first_name', p_row.first_name,
    'last_name', p_row.last_name,
    'email', p_row.email,
    'phone', p_row.phone,
    'oib', p_row.oib,
    'created_at', p_row.created_at,
    'deleted_at', p_row.deleted_at
  );
$$;

create or replace function public.clients_write_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'Client write requires an authenticated user';
  end if;

  if tg_op = 'INSERT' then
    insert into public.client_audit_events (
      actor_id, action, entity, entity_id, previous_value, new_value
    ) values (
      uid, 'CREATE', 'Client', new.id, null, public.clients_row_payload(new)
    );
    return new;
  elsif tg_op = 'UPDATE' then
    if old.deleted_at is null and new.deleted_at is not null then
      insert into public.client_audit_events (
        actor_id, action, entity, entity_id, previous_value, new_value
      ) values (
        uid, 'DELETE', 'Client', new.id, public.clients_row_payload(old), null
      );
    else
      insert into public.client_audit_events (
        actor_id, action, entity, entity_id, previous_value, new_value
      ) values (
        uid,
        'UPDATE',
        'Client',
        new.id,
        public.clients_row_payload(old),
        public.clients_row_payload(new)
      );
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.client_audit_events (
      actor_id, action, entity, entity_id, previous_value, new_value
    ) values (
      uid, 'DELETE', 'Client', old.id, public.clients_row_payload(old), null
    );
    return old;
  end if;

  return null;
end;
$$;

drop policy if exists clients_select_authenticated on public.clients;
create policy clients_select_authenticated
  on public.clients
  for select
  to authenticated
  using (
    deleted_at is null
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('ADMIN', 'VIEWER')
    )
  );

-- ADMIN may SELECT soft-deleted rows so UPDATE ... RETURNING after
-- delete succeeds. The SPA still lists only deleted_at is null.
drop policy if exists clients_select_admin_deleted on public.clients;
create policy clients_select_admin_deleted
  on public.clients
  for select
  to authenticated
  using (
    deleted_at is not null
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'ADMIN'
    )
  );

alter table public.products enable row level security;
alter table public.client_products enable row level security;

drop policy if exists products_select_authenticated on public.products;
create policy products_select_authenticated
  on public.products
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('ADMIN', 'VIEWER')
    )
  );

drop policy if exists client_products_select_authenticated on public.client_products;
create policy client_products_select_authenticated
  on public.client_products
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('ADMIN', 'VIEWER')
    )
  );

drop policy if exists client_products_insert_admin on public.client_products;
create policy client_products_insert_admin
  on public.client_products
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'ADMIN'
    )
  );

drop policy if exists client_products_delete_admin on public.client_products;
create policy client_products_delete_admin
  on public.client_products
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'ADMIN'
    )
  );

revoke all on table public.products from public, anon;
grant select on table public.products to authenticated;

revoke all on table public.client_products from public, anon;
grant select, insert, delete on table public.client_products to authenticated;
