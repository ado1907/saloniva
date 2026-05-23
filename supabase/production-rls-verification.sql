-- Saloniva production RLS verification
-- Run after supabase/schema.sql and supabase/phase2-auth.sql.
-- This file does not change data; it lists security posture for release QA.

select
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
  and tablename in (
    'salons',
    'salon_members',
    'customers',
    'appointments',
    'service_packages',
    'payments',
    'salon_services',
    'staff_members',
    'inventory_items',
    'booking_requests',
    'audit_logs'
  )
order by tablename;

select
  tablename,
  policyname,
  cmd,
  roles,
  permissive
from pg_policies
where schemaname = 'public'
  and tablename in (
    'salons',
    'salon_members',
    'customers',
    'appointments',
    'service_packages',
    'payments',
    'salon_services',
    'staff_members',
    'inventory_items',
    'booking_requests',
    'audit_logs'
  )
order by tablename, policyname;

select
  n.nspname as schema_name,
  p.proname as function_name,
  p.prosecdef as security_definer
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('is_salon_member', 'has_salon_role', 'register_salon_account', 'get_my_salon_account', 'get_my_salon_accounts')
order by p.proname;
select
  'missing_policy_count' as check_name,
  count(*) as missing_count
from (
  values
    ('salons', 'members can read own salons'),
    ('salons', 'owners can update own salons'),
    ('salon_members', 'members can read salon membership'),
    ('salon_members', 'owners can manage salon membership'),
    ('customers', 'members can read customers'),
    ('customers', 'staff can write customers'),
    ('appointments', 'members can read appointments'),
    ('appointments', 'staff can write appointments'),
    ('service_packages', 'members can read packages'),
    ('service_packages', 'staff can write packages'),
    ('payments', 'managers can read payments'),
    ('payments', 'managers can write payments'),
    ('salon_services', 'members can read services'),
    ('salon_services', 'managers can write services'),
    ('staff_members', 'members can read staff'),
    ('staff_members', 'managers can write staff'),
    ('inventory_items', 'members can read inventory'),
    ('inventory_items', 'managers can write inventory'),
    ('booking_requests', 'members can read booking requests'),
    ('booking_requests', 'staff can manage booking requests'),
    ('audit_logs', 'owners can read audit logs'),
    ('audit_logs', 'members can create audit logs')
) as expected(tablename, policyname)
left join pg_policies policies
  on policies.schemaname = 'public'
 and policies.tablename = expected.tablename
 and policies.policyname = expected.policyname
where policies.policyname is null;

select
  'personel_not_allowed_to_write_customers_or_packages' as check_name,
  count(*) = 0 as passed
from pg_policies
where schemaname = 'public'
  and tablename in ('customers', 'service_packages')
  and policyname in ('staff can write customers', 'staff can write packages')
  and (
    qual ilike '%Personel%'
    or with_check ilike '%Personel%'
  );

