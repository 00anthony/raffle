-- Phase 2: atomic, race-condition-safe ticket sequence allocation, scoped per raffle.
-- FOR UPDATE serializes concurrent purchases for the SAME raffle; different
-- raffles never block each other since the lock is per raffle_id row.
create or replace function allocate_ticket_sequences(
  p_raffle_id uuid,
  p_count int
)
returns table(sequence_number int) as $$
declare
  v_start int;
begin
  insert into raffle_ticket_counters (raffle_id, next_sequence)
  values (p_raffle_id, 1)
  on conflict (raffle_id) do nothing;

  select next_sequence into v_start
  from raffle_ticket_counters
  where raffle_id = p_raffle_id
  for update;

  update raffle_ticket_counters
  set next_sequence = v_start + p_count
  where raffle_id = p_raffle_id;

  return query
  select generate_series(v_start, v_start + p_count - 1);
end;
$$ language plpgsql;
