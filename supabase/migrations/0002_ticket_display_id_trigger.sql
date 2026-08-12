-- Phase 2: display_id is enforced via trigger, not a generated column,
-- because Postgres stored generated columns can't reference other tables
-- (display_id needs raffles.ticket_prefix + raffles.ticket_number_padding).
create or replace function set_ticket_display_id()
returns trigger as $$
declare
  v_prefix  text;
  v_padding int;
begin
  select ticket_prefix, ticket_number_padding
  into v_prefix, v_padding
  from raffles
  where id = new.raffle_id;

  if v_prefix is null then
    raise exception 'Raffle % not found or missing ticket_prefix', new.raffle_id;
  end if;

  new.display_id := v_prefix || '-' || lpad(new.sequence_number::text, v_padding, '0');
  return new;
end;
$$ language plpgsql;

create trigger tickets_set_display_id
  before insert on tickets
  for each row
  execute function set_ticket_display_id();
