-- CRM-001 Client records and append-only audit. Apply to non-production only.
-- Do not run against production from the agent.

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  oib text not null,
  created_at timestamptz not null default now(),
  constraint clients_first_name_present check (char_length(btrim(first_name)) >= 1),
  constraint clients_last_name_present check (char_length(btrim(last_name)) >= 1),
  constraint clients_email_format check (
    email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint clients_phone_format check (
    btrim(phone) ~ '^\+?[0-9 ]+$'
    and char_length(regexp_replace(btrim(phone), '[^0-9]', '', 'g')) between 8 and 15
  ),
  constraint clients_oib_digits check (oib ~ '^[0-9]{11}$')
);

create unique index if not exists clients_email_lower_key
  on public.clients (lower(email));

create table if not exists public.client_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null,
  action text not null check (action in ('CREATE', 'UPDATE', 'DELETE')),
  entity text not null default 'Client' check (entity = 'Client'),
  entity_id uuid not null,
  occurred_at timestamptz not null default now(),
  previous_value jsonb,
  new_value jsonb,
  constraint client_audit_create_values check (
    action <> 'CREATE' or (previous_value is null and new_value is not null)
  ),
  constraint client_audit_delete_values check (
    action <> 'DELETE' or (previous_value is not null and new_value is null)
  ),
  constraint client_audit_update_values check (
    action <> 'UPDATE' or (previous_value is not null and new_value is not null)
  )
);

create or replace function public.clients_row_payload(row public.clients)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'id', row.id,
    'first_name', row.first_name,
    'last_name', row.last_name,
    'email', row.email,
    'phone', row.phone,
    'oib', row.oib,
    'created_at', row.created_at
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

drop trigger if exists clients_write_audit on public.clients;
create trigger clients_write_audit
  after insert or update or delete on public.clients
  for each row
  execute procedure public.clients_write_audit();

alter table public.clients enable row level security;
alter table public.client_audit_events enable row level security;

drop policy if exists clients_select_authenticated on public.clients;
create policy clients_select_authenticated
  on public.clients
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

drop policy if exists clients_insert_admin on public.clients;
create policy clients_insert_admin
  on public.clients
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

drop policy if exists clients_update_admin on public.clients;
create policy clients_update_admin
  on public.clients
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'ADMIN'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'ADMIN'
    )
  );

drop policy if exists clients_delete_admin on public.clients;
create policy clients_delete_admin
  on public.clients
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

revoke all on table public.clients from public, anon;
grant select, insert, update, delete on table public.clients to authenticated;

revoke all on table public.client_audit_events from public, anon, authenticated;
revoke all on function public.clients_write_audit() from public, anon, authenticated;
revoke all on function public.clients_row_payload(public.clients) from public, anon, authenticated;
