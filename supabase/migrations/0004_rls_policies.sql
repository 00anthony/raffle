-- Phase 2: Row Level Security. Public (anon) gets narrow read access;
-- everything else requires admin membership or the service-role key.
alter table raffles enable row level security;
alter table purchases enable row level security;
alter table tickets enable row level security;
alter table draws enable row level security;
alter table admin_profiles enable row level security;
alter table webhook_events enable row level security;
alter table raffle_ticket_counters enable row level security;

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_profiles where user_id = auth.uid()
  );
$$ language sql security definer stable;

-- RAFFLES: draft raffles are invisible to the public — no preview without
-- admin login. Confirmed deliberately (Phase 2 sign-off).
create policy "public read active raffles" on raffles
  for select using (status in ('active','paused','drawing','completed'));

create policy "admin full access raffles" on raffles
  for all using (is_admin()) with check (is_admin());

-- PURCHASES / TICKETS: no public policy at all. Buyers are anonymous (no
-- auth.uid() to scope a policy to), so confirmation-page access is enforced
-- at the application layer via a signed HMAC token (Phase 7), using the
-- service-role client after the token is verified — not via RLS.
create policy "admin full access purchases" on purchases
  for all using (is_admin()) with check (is_admin());

create policy "admin full access tickets" on tickets
  for all using (is_admin()) with check (is_admin());

-- DRAWS: winner announcements are public info once a raffle is completed.
create policy "public read completed draws" on draws
  for select using (
    exists (select 1 from raffles r where r.id = raffle_id and r.status = 'completed')
  );

create policy "admin full access draws" on draws
  for all using (is_admin()) with check (is_admin());

-- ADMIN_PROFILES: admins can read the roster; only superadmins manage it.
create policy "admin read admin_profiles" on admin_profiles
  for select using (is_admin());

create policy "superadmin manage admin_profiles" on admin_profiles
  for all using (
    exists (select 1 from admin_profiles where user_id = auth.uid() and role = 'superadmin')
  );

-- WEBHOOK_EVENTS, RAFFLE_TICKET_COUNTERS: zero policies = zero access outside
-- the service-role key (webhook handler, ticket allocation from trusted code).
