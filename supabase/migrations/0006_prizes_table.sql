-- Phase 3: prizes as their own table (not jsonb on raffles) since they're a
-- variable-length, individually-editable list — consistent with how tickets
-- and purchases are already separate tables rather than arrays on raffles.
create table prizes (
  id               uuid primary key default gen_random_uuid(),
  raffle_id        uuid not null references raffles(id) on delete cascade,
  title            text not null,
  description      text,
  image_url        text,
  estimated_value  numeric(10,2),
  sort_order       int not null default 0,
  created_at       timestamptz not null default now()
);

create index prizes_raffle_lookup on prizes (raffle_id);

alter table prizes enable row level security;

create policy "public read prizes for visible raffles" on prizes
  for select using (
    exists (
      select 1 from raffles r
      where r.id = raffle_id and r.status in ('active','paused','drawing','completed')
    )
  );

create policy "admin full access prizes" on prizes
  for all using (is_admin()) with check (is_admin());
