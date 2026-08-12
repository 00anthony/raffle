-- Phase 3: event-specific metadata fields, added deliberately now to avoid
-- future migrations, without overengineering into full multi-org modeling.
alter table raffles
  add column organization_name     text,
  add column organization_logo_url text,
  add column event_location        text,
  add column hero_image_url        text,
  add column theme                 jsonb not null default '{}',
  add column countdown_target      text not null default 'end_date'
                                     check (countdown_target in ('end_date','drawing_date')),
  add column legal_disclaimer      text,
  add column contact_email         text,
  add column contact_phone         text,
  add column og_image_url          text;
