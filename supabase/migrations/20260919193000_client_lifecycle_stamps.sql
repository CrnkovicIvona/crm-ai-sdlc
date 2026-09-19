-- BUG-004 / TD-D005: dashboard stamps for ADMIN and VIEWER.
-- Does not change clients RLS. CRM list stays active-only.
-- security_invoker = false: view owner reads all clients rows; auth.uid()
-- still gates ADMIN/VIEWER. No PII columns.

create or replace view public.client_lifecycle_stamps
  with (security_invoker = false) as
select
  c.id,
  c.created_at,
  c.deleted_at
from public.clients c
where exists (
  select 1
  from public.profiles p
  where p.id = auth.uid()
    and p.role in ('ADMIN', 'VIEWER')
);

comment on view public.client_lifecycle_stamps is
  'DASH-001 stamps (id, created_at, deleted_at) including soft-deleted rows. Not a PII source.';

revoke all on public.client_lifecycle_stamps from public;
revoke all on public.client_lifecycle_stamps from anon;
grant select on public.client_lifecycle_stamps to authenticated;
revoke insert, update, delete on public.client_lifecycle_stamps from authenticated;
