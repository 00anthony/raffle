-- Phase 3/4: rules as jsonb array of { title, text } objects, e.g.
--   { "title": "Eligibility", "text": "Must be 18 years or older." }
-- Written as a safe type conversion (handles pre-existing text[] rows too),
-- though at this stage of the project no raffle data exists yet.
alter table raffles add column if not exists rules text[] not null default '{}';

alter table raffles
  alter column rules type jsonb
  using (
    coalesce(
      (
        select jsonb_agg(jsonb_build_object('title', null, 'text', elem))
        from unnest(rules) as elem
      ),
      '[]'::jsonb
    )
  );

alter table raffles
  alter column rules set default '[]'::jsonb,
  alter column rules set not null;
