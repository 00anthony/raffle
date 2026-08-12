-- Phase 2: core schema. Raffle-first design — every table is scoped by raffle_id.
create extension if not exists "pgcrypto";

create table raffles (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  title                 text not null,
  description           text,
  ticket_prefix         text not null unique,
  ticket_number_padding int not null default 6,
  ticket_price          numeric(10,2) not null,
  status                text not null default 'draft'
                          check (status in ('draft','active','paused','drawing','completed','archived')),
  start_date            timestamptz,
  end_date              timestamptz,
  drawing_date          timestamptz,
  payment_accounts      jsonb not null default '{}',
  qr_code_url           text,
  created_by            uuid references auth.users(id),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table raffle_ticket_counters (
  raffle_id     uuid primary key references raffles(id) on delete cascade,
  next_sequence int not null default 1
);

create table purchases (
  id                        uuid primary key default gen_random_uuid(),
  raffle_id                 uuid not null references raffles(id),
  buyer_name                text not null,
  buyer_email               text not null,
  buyer_phone               text,
  payment_method            text not null
                              check (payment_method in ('stripe','cashapp','venmo','zelle','cash')),
  payment_status            text not null default 'pending'
                              check (payment_status in ('pending','pending_verification','approved','rejected','refunded')),
  ticket_count              int not null check (ticket_count > 0),
  amount_paid               numeric(10,2) not null,
  stripe_session_id         text unique,
  stripe_payment_intent_id  text unique,
  payment_reference         text,
  approved_by               uuid references auth.users(id),
  approved_at               timestamptz,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create table tickets (
  id               uuid primary key default gen_random_uuid(),
  raffle_id        uuid not null references raffles(id),
  purchase_id      uuid not null references purchases(id),
  sequence_number  int not null,
  display_id       text, -- populated by trigger in 0002 (cross-table generated columns aren't supported)
  created_at       timestamptz not null default now(),
  unique (raffle_id, sequence_number)
);

create unique index tickets_display_id_unique on tickets (raffle_id, display_id);
create index tickets_raffle_lookup on tickets (raffle_id);
create index purchases_raffle_lookup on purchases (raffle_id);
create index purchases_email_lookup on purchases (buyer_email);

create table webhook_events (
  id            uuid primary key default gen_random_uuid(),
  provider      text not null default 'stripe',
  event_id      text not null unique,
  processed_at  timestamptz not null default now()
);

create table draws (
  id                uuid primary key default gen_random_uuid(),
  raffle_id         uuid not null references raffles(id),
  winning_ticket_id uuid not null references tickets(id),
  drawn_by          uuid references auth.users(id),
  drawn_at          timestamptz not null default now(),
  seed              text not null
);

create table admin_profiles (
  user_id     uuid primary key references auth.users(id),
  role        text not null default 'admin' check (role in ('admin','superadmin')),
  created_at  timestamptz not null default now()
);
