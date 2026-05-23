-- Saloniva production RLS isolation test
-- Run after supabase/schema.sql, supabase/phase2-auth.sql and supabase/phase2-tenant-hardening.sql.
-- This file is filled with the current two production test accounts.
--
-- User A / Salon A
-- user_id: 02a50a80-7085-488d-9f74-d1238ff76751
-- salon_id: 5419c0db-4eb0-4410-92f8-f0c17e04f0bb
--
-- User B / Salon B
-- user_id: 20f4a730-c120-4b4b-a111-f7c9cabe1762
-- salon_id: 2e637e2c-7814-478e-84d0-fc357e287007
--
-- Expected:
-- - All "cannot see" rows must be 0.
-- - All write probes must print PASS notices.
-- - If any FAILED notice/error appears, stop release and review RLS policies.

begin;

set local role authenticated;
select set_config('request.jwt.claim.sub', '02a50a80-7085-488d-9f74-d1238ff76751', true);

select 'A own customers' as check_name, count(*) as visible_rows
from public.customers
where salon_id = '5419c0db-4eb0-4410-92f8-f0c17e04f0bb';

select 'A cannot see B customers' as check_name, count(*) as visible_rows
from public.customers
where salon_id = '2e637e2c-7814-478e-84d0-fc357e287007';

select 'A cannot see B appointments' as check_name, count(*) as visible_rows
from public.appointments
where salon_id = '2e637e2c-7814-478e-84d0-fc357e287007';

select 'A cannot see B services' as check_name, count(*) as visible_rows
from public.salon_services
where salon_id = '2e637e2c-7814-478e-84d0-fc357e287007';

select 'A cannot see B staff' as check_name, count(*) as visible_rows
from public.staff_members
where salon_id = '2e637e2c-7814-478e-84d0-fc357e287007';

select 'A cannot see B packages' as check_name, count(*) as visible_rows
from public.service_packages
where salon_id = '2e637e2c-7814-478e-84d0-fc357e287007';

select 'A cannot see B payments' as check_name, count(*) as visible_rows
from public.payments
where salon_id = '2e637e2c-7814-478e-84d0-fc357e287007';

do $$
begin
  begin
    insert into public.customers (salon_id, name, phone, package_label)
    values ('2e637e2c-7814-478e-84d0-fc357e287007', 'RLS Leak Probe A', '0000000000', 'RLS test');
    raise exception 'FAILED: User A inserted customer into Salon B';
  exception when insufficient_privilege then
    raise notice 'PASS: User A cannot insert customer into Salon B';
  end;

  begin
    insert into public.appointments (salon_id, customer_name, phone, service_name, staff_name, starts_at, ends_at, price, status)
    values ('2e637e2c-7814-478e-84d0-fc357e287007', 'RLS Leak Probe A', '0000000000', 'RLS Test', 'Probe', '10:00', '10:30', 0, 'Planlandi');
    raise exception 'FAILED: User A inserted appointment into Salon B';
  exception when insufficient_privilege then
    raise notice 'PASS: User A cannot insert appointment into Salon B';
  end;

  begin
    insert into public.service_packages (salon_id, customer_name, title, total_sessions, used_sessions, total_price, paid)
    values ('2e637e2c-7814-478e-84d0-fc357e287007', 'RLS Leak Probe A', 'RLS Test', 1, 0, 0, 0);
    raise exception 'FAILED: User A inserted package into Salon B';
  exception when insufficient_privilege then
    raise notice 'PASS: User A cannot insert package into Salon B';
  end;

  begin
    insert into public.payments (salon_id, customer_name, service_name, paid_at, amount, method, status, remaining)
    values ('2e637e2c-7814-478e-84d0-fc357e287007', 'RLS Leak Probe A', 'RLS Test', 'Bugun', 0, 'Nakit', 'Bekliyor', 0);
    raise exception 'FAILED: User A inserted payment into Salon B';
  exception when insufficient_privilege then
    raise notice 'PASS: User A cannot insert payment into Salon B';
  end;

  begin
    insert into public.salon_services (salon_id, name, category, duration_minutes, price)
    values ('2e637e2c-7814-478e-84d0-fc357e287007', 'RLS Test', 'Test', 30, 0);
    raise exception 'FAILED: User A inserted service into Salon B';
  exception when insufficient_privilege then
    raise notice 'PASS: User A cannot insert service into Salon B';
  end;

  begin
    insert into public.staff_members (salon_id, name, role, phone)
    values ('2e637e2c-7814-478e-84d0-fc357e287007', 'RLS Probe', 'Personel', '0000000000');
    raise exception 'FAILED: User A inserted staff into Salon B';
  exception when insufficient_privilege then
    raise notice 'PASS: User A cannot insert staff into Salon B';
  end;

  begin
    insert into public.inventory_items (salon_id, name, category, quantity, unit, min_quantity, cost)
    values ('2e637e2c-7814-478e-84d0-fc357e287007', 'RLS Probe', 'Test', 1, 'adet', 1, 0);
    raise exception 'FAILED: User A inserted inventory into Salon B';
  exception when insufficient_privilege then
    raise notice 'PASS: User A cannot insert inventory into Salon B';
  end;

  begin
    insert into public.booking_requests (salon_id, customer_name, phone, service_name, preferred_time)
    values ('2e637e2c-7814-478e-84d0-fc357e287007', 'RLS Probe', '0000000000', 'RLS Test', 'Bugun');
    raise exception 'FAILED: User A inserted booking request into Salon B';
  exception when insufficient_privilege then
    raise notice 'PASS: User A cannot insert booking request into Salon B';
  end;
end $$;

rollback;

begin;

set local role authenticated;
select set_config('request.jwt.claim.sub', '20f4a730-c120-4b4b-a111-f7c9cabe1762', true);

select 'B own customers' as check_name, count(*) as visible_rows
from public.customers
where salon_id = '2e637e2c-7814-478e-84d0-fc357e287007';

select 'B cannot see A customers' as check_name, count(*) as visible_rows
from public.customers
where salon_id = '5419c0db-4eb0-4410-92f8-f0c17e04f0bb';

select 'B cannot see A appointments' as check_name, count(*) as visible_rows
from public.appointments
where salon_id = '5419c0db-4eb0-4410-92f8-f0c17e04f0bb';

select 'B cannot see A services' as check_name, count(*) as visible_rows
from public.salon_services
where salon_id = '5419c0db-4eb0-4410-92f8-f0c17e04f0bb';

select 'B cannot see A staff' as check_name, count(*) as visible_rows
from public.staff_members
where salon_id = '5419c0db-4eb0-4410-92f8-f0c17e04f0bb';

select 'B cannot see A packages' as check_name, count(*) as visible_rows
from public.service_packages
where salon_id = '5419c0db-4eb0-4410-92f8-f0c17e04f0bb';

select 'B cannot see A payments' as check_name, count(*) as visible_rows
from public.payments
where salon_id = '5419c0db-4eb0-4410-92f8-f0c17e04f0bb';

do $$
begin
  begin
    insert into public.customers (salon_id, name, phone, package_label)
    values ('5419c0db-4eb0-4410-92f8-f0c17e04f0bb', 'RLS Leak Probe B', '0000000000', 'RLS test');
    raise exception 'FAILED: User B inserted customer into Salon A';
  exception when insufficient_privilege then
    raise notice 'PASS: User B cannot insert customer into Salon A';
  end;

  begin
    insert into public.appointments (salon_id, customer_name, phone, service_name, staff_name, starts_at, ends_at, price, status)
    values ('5419c0db-4eb0-4410-92f8-f0c17e04f0bb', 'RLS Leak Probe B', '0000000000', 'RLS Test', 'Probe', '10:00', '10:30', 0, 'Planlandi');
    raise exception 'FAILED: User B inserted appointment into Salon A';
  exception when insufficient_privilege then
    raise notice 'PASS: User B cannot insert appointment into Salon A';
  end;

  begin
    insert into public.service_packages (salon_id, customer_name, title, total_sessions, used_sessions, total_price, paid)
    values ('5419c0db-4eb0-4410-92f8-f0c17e04f0bb', 'RLS Leak Probe B', 'RLS Test', 1, 0, 0, 0);
    raise exception 'FAILED: User B inserted package into Salon A';
  exception when insufficient_privilege then
    raise notice 'PASS: User B cannot insert package into Salon A';
  end;

  begin
    insert into public.payments (salon_id, customer_name, service_name, paid_at, amount, method, status, remaining)
    values ('5419c0db-4eb0-4410-92f8-f0c17e04f0bb', 'RLS Leak Probe B', 'RLS Test', 'Bugun', 0, 'Nakit', 'Bekliyor', 0);
    raise exception 'FAILED: User B inserted payment into Salon A';
  exception when insufficient_privilege then
    raise notice 'PASS: User B cannot insert payment into Salon A';
  end;

  begin
    insert into public.salon_services (salon_id, name, category, duration_minutes, price)
    values ('5419c0db-4eb0-4410-92f8-f0c17e04f0bb', 'RLS Test', 'Test', 30, 0);
    raise exception 'FAILED: User B inserted service into Salon A';
  exception when insufficient_privilege then
    raise notice 'PASS: User B cannot insert service into Salon A';
  end;

  begin
    insert into public.staff_members (salon_id, name, role, phone)
    values ('5419c0db-4eb0-4410-92f8-f0c17e04f0bb', 'RLS Probe', 'Personel', '0000000000');
    raise exception 'FAILED: User B inserted staff into Salon A';
  exception when insufficient_privilege then
    raise notice 'PASS: User B cannot insert staff into Salon A';
  end;

  begin
    insert into public.inventory_items (salon_id, name, category, quantity, unit, min_quantity, cost)
    values ('5419c0db-4eb0-4410-92f8-f0c17e04f0bb', 'RLS Probe', 'Test', 1, 'adet', 1, 0);
    raise exception 'FAILED: User B inserted inventory into Salon A';
  exception when insufficient_privilege then
    raise notice 'PASS: User B cannot insert inventory into Salon A';
  end;

  begin
    insert into public.booking_requests (salon_id, customer_name, phone, service_name, preferred_time)
    values ('5419c0db-4eb0-4410-92f8-f0c17e04f0bb', 'RLS Probe', '0000000000', 'RLS Test', 'Bugun');
    raise exception 'FAILED: User B inserted booking request into Salon A';
  exception when insufficient_privilege then
    raise notice 'PASS: User B cannot insert booking request into Salon A';
  end;
end $$;

rollback;
