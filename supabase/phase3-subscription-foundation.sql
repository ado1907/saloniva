-- Saloniva phase 3 subscription foundation
-- Run after supabase/schema.sql, supabase/phase2-auth.sql and supabase/phase2-tenant-hardening.sql.
-- Safe to run more than once. This file does not add Stripe, iyzico or webhook integration.

create extension if not exists "pgcrypto";

create table if not exists public.plans (
  id text primary key,
  name text not null,
  description text not null,
  monthly_price_try integer not null default 0,
  currency text not null default 'TRY',
  staff_limit integer not null default 2,
  customer_limit integer not null default 50,
  monthly_appointment_limit integer not null default 100,
  branch_limit integer not null default 1,
  monthly_booking_request_limit integer not null default 25,
  can_use_reports boolean not null default false,
  can_use_campaigns boolean not null default false,
  can_use_multi_branch boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.salon_subscriptions (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null unique references public.salons(id) on delete cascade,
  plan_id text not null references public.plans(id),
  status text not null default 'trialing'
    check (status in ('trialing', 'active', 'past_due', 'canceled', 'expired')),
  provider text not null default 'manual'
    check (provider in ('manual', 'iyzico', 'stripe', 'app_store', 'google_play')),
  provider_customer_id text,
  provider_subscription_id text,
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  past_due_at timestamptz,
  grace_until timestamptz,
  admin_override_until timestamptz,
  admin_override_reason text,
  admin_override_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscription_events (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  subscription_id uuid references public.salon_subscriptions(id) on delete set null,
  provider text not null default 'manual',
  provider_event_id text not null,
  event_type text not null,
  payload jsonb not null default '{}',
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create table if not exists public.usage_counters (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  appointments_count integer not null default 0,
  booking_requests_count integer not null default 0,
  customers_count integer not null default 0,
  staff_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (salon_id, period_start)
);

create index if not exists idx_salon_subscriptions_salon_id on public.salon_subscriptions(salon_id);
create index if not exists idx_salon_subscriptions_status on public.salon_subscriptions(status);
create index if not exists idx_subscription_events_salon_id on public.subscription_events(salon_id);
create index if not exists idx_usage_counters_salon_period on public.usage_counters(salon_id, period_start);

create or replace function public.saloniva_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_plans_updated_at on public.plans;
create trigger set_plans_updated_at
  before update on public.plans
  for each row execute function public.saloniva_set_updated_at();

drop trigger if exists set_salon_subscriptions_updated_at on public.salon_subscriptions;
create trigger set_salon_subscriptions_updated_at
  before update on public.salon_subscriptions
  for each row execute function public.saloniva_set_updated_at();

drop trigger if exists set_usage_counters_updated_at on public.usage_counters;
create trigger set_usage_counters_updated_at
  before update on public.usage_counters
  for each row execute function public.saloniva_set_updated_at();

insert into public.plans (
  id,
  name,
  description,
  monthly_price_try,
  staff_limit,
  customer_limit,
  monthly_appointment_limit,
  branch_limit,
  monthly_booking_request_limit,
  can_use_reports,
  can_use_campaigns,
  can_use_multi_branch,
  active
) values
  (
    'free',
    'Free',
    'Yeni salonlar icin temel randevu, musteri ve gelir ozeti.',
    0,
    2,
    50,
    100,
    1,
    25,
    false,
    false,
    false,
    true
  ),
  (
    'pro',
    'Pro',
    'Aktif salonlar icin paket, odeme, personel ve online talep yonetimi.',
    299,
    10,
    2000,
    1500,
    1,
    500,
    true,
    true,
    false,
    true
  ),
  (
    'business',
    'Business',
    'Cok subeli salonlar ve premium markalar icin gelismis operasyon paketi.',
    699,
    -1,
    -1,
    -1,
    10,
    -1,
    true,
    true,
    true,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  monthly_price_try = excluded.monthly_price_try,
  currency = excluded.currency,
  staff_limit = excluded.staff_limit,
  customer_limit = excluded.customer_limit,
  monthly_appointment_limit = excluded.monthly_appointment_limit,
  branch_limit = excluded.branch_limit,
  monthly_booking_request_limit = excluded.monthly_booking_request_limit,
  can_use_reports = excluded.can_use_reports,
  can_use_campaigns = excluded.can_use_campaigns,
  can_use_multi_branch = excluded.can_use_multi_branch,
  active = excluded.active;

insert into public.salon_subscriptions (
  salon_id,
  plan_id,
  status,
  provider,
  trial_started_at,
  trial_ends_at,
  current_period_start,
  current_period_end,
  grace_until
)
select
  salons.id,
  case
    when lower(coalesce(salons.plan_id, '')) = 'premium' then 'business'
    when lower(coalesce(salons.plan_id, '')) = 'business' then 'business'
    when lower(coalesce(salons.plan_id, '')) = 'pro' then 'pro'
    when lower(coalesce(salons.subscription_status, '')) = lower('Deneme') then 'pro'
    else 'free'
  end,
  case
    when lower(coalesce(salons.subscription_status, '')) = lower('Deneme') then 'trialing'
    when lower(coalesce(salons.subscription_status, '')) = lower('Aktif') then 'active'
    else 'active'
  end,
  'manual',
  case
    when lower(coalesce(salons.subscription_status, '')) = lower('Deneme') then salons.created_at
    else null
  end,
  case
    when lower(coalesce(salons.subscription_status, '')) = lower('Deneme') then coalesce(salons.trial_ends_at, now() + interval '14 days')
    else null
  end,
  salons.created_at,
  coalesce(salons.trial_ends_at, now() + interval '30 days'),
  null
from public.salons salons
where not exists (
  select 1
  from public.salon_subscriptions existing
  where existing.salon_id = salons.id
);

create or replace function public.ensure_default_salon_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.salon_subscriptions (
    salon_id,
    plan_id,
    status,
    provider,
    trial_started_at,
    trial_ends_at,
    current_period_start,
    current_period_end
  )
  values (
    new.id,
    case
      when lower(coalesce(new.subscription_status, '')) = lower('Deneme') then 'pro'
      else 'free'
    end,
    case
      when lower(coalesce(new.subscription_status, '')) = lower('Deneme') then 'trialing'
      else 'active'
    end,
    'manual',
    case
      when lower(coalesce(new.subscription_status, '')) = lower('Deneme') then new.created_at
      else null
    end,
    case
      when lower(coalesce(new.subscription_status, '')) = lower('Deneme') then coalesce(new.trial_ends_at, now() + interval '14 days')
      else null
    end,
    new.created_at,
    coalesce(new.trial_ends_at, now() + interval '30 days')
  )
  on conflict (salon_id) do nothing;

  return new;
end;
$$;

drop trigger if exists ensure_default_salon_subscription_after_insert on public.salons;
create trigger ensure_default_salon_subscription_after_insert
  after insert on public.salons
  for each row execute function public.ensure_default_salon_subscription();

alter table public.plans enable row level security;
alter table public.salon_subscriptions enable row level security;
alter table public.subscription_events enable row level security;
alter table public.usage_counters enable row level security;

drop policy if exists "active plans are readable" on public.plans;
create policy "active plans are readable" on public.plans
  for select using (active = true);

drop policy if exists "members can read own salon subscriptions" on public.salon_subscriptions;
create policy "members can read own salon subscriptions" on public.salon_subscriptions
  for select using (public.is_salon_member(salon_id));

drop policy if exists "members can read own subscription events" on public.subscription_events;
create policy "members can read own subscription events" on public.subscription_events
  for select using (public.is_salon_member(salon_id));

drop policy if exists "members can read own usage counters" on public.usage_counters;
create policy "members can read own usage counters" on public.usage_counters
  for select using (public.is_salon_member(salon_id));

create or replace function public.get_salon_subscription_status(target_salon_id uuid)
returns table (
  salon_id uuid,
  plan_id text,
  plan_name text,
  status text,
  provider text,
  is_active boolean,
  is_in_trial boolean,
  is_in_grace boolean,
  can_create_records boolean,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  grace_until timestamptz,
  admin_override_until timestamptz,
  staff_limit integer,
  customer_limit integer,
  monthly_appointment_limit integer,
  branch_limit integer,
  monthly_booking_request_limit integer,
  current_staff_count integer,
  current_customer_count integer,
  current_month_appointment_count integer,
  current_month_booking_request_count integer
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  if not public.is_salon_member(target_salon_id) then
    raise exception 'access_denied';
  end if;

  return query
  select
    subscription.salon_id,
    plan.id,
    plan.name,
    subscription.status,
    subscription.provider,
    (
      subscription.status in ('trialing', 'active')
      or coalesce(subscription.grace_until, '-infinity'::timestamptz) > now()
      or coalesce(subscription.admin_override_until, '-infinity'::timestamptz) > now()
    ) as is_active,
    (
      subscription.status = 'trialing'
      and coalesce(subscription.trial_ends_at, '-infinity'::timestamptz) > now()
    ) as is_in_trial,
    (
      subscription.status = 'past_due'
      and coalesce(subscription.grace_until, '-infinity'::timestamptz) > now()
    ) as is_in_grace,
    (
      subscription.status in ('trialing', 'active')
      or coalesce(subscription.grace_until, '-infinity'::timestamptz) > now()
      or coalesce(subscription.admin_override_until, '-infinity'::timestamptz) > now()
    ) as can_create_records,
    subscription.trial_ends_at,
    subscription.current_period_end,
    subscription.grace_until,
    subscription.admin_override_until,
    plan.staff_limit,
    plan.customer_limit,
    plan.monthly_appointment_limit,
    plan.branch_limit,
    plan.monthly_booking_request_limit,
    (select count(*)::integer from public.staff_members staff where staff.salon_id = target_salon_id) as current_staff_count,
    (select count(*)::integer from public.customers customer where customer.salon_id = target_salon_id) as current_customer_count,
    (
      select count(*)::integer
      from public.appointments appointment
      where appointment.salon_id = target_salon_id
        and appointment.created_at >= date_trunc('month', now())
    ) as current_month_appointment_count,
    (
      select count(*)::integer
      from public.booking_requests request
      where request.salon_id = target_salon_id
        and request.created_at >= date_trunc('month', now())
    ) as current_month_booking_request_count
  from public.salon_subscriptions subscription
  join public.plans plan on plan.id = subscription.plan_id
  where subscription.salon_id = target_salon_id
  limit 1;
end;
$$;

create or replace function public.check_plan_limit(
  target_salon_id uuid,
  limit_key text,
  requested_increment integer default 1
)
returns table (
  checked_limit text,
  allowed boolean,
  current_usage integer,
  plan_limit integer,
  status text,
  reason text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  subscription_state record;
  safe_increment integer;
  usage_value integer;
  limit_value integer;
begin
  safe_increment := greatest(coalesce(requested_increment, 1), 1);

  select *
  into subscription_state
  from public.get_salon_subscription_status(target_salon_id)
  limit 1;

  if not found then
    raise exception 'subscription_not_found';
  end if;

  case limit_key
    when 'staff' then
      usage_value := subscription_state.current_staff_count;
      limit_value := subscription_state.staff_limit;
    when 'customers' then
      usage_value := subscription_state.current_customer_count;
      limit_value := subscription_state.customer_limit;
    when 'appointments_monthly' then
      usage_value := subscription_state.current_month_appointment_count;
      limit_value := subscription_state.monthly_appointment_limit;
    when 'branches' then
      usage_value := 1;
      limit_value := subscription_state.branch_limit;
    when 'booking_requests_monthly' then
      usage_value := subscription_state.current_month_booking_request_count;
      limit_value := subscription_state.monthly_booking_request_limit;
    else
      raise exception 'unknown_limit_key';
  end case;

  if not subscription_state.can_create_records then
    return query select limit_key, false, usage_value, limit_value, subscription_state.status, 'subscription_inactive';
  elsif limit_value = -1 then
    return query select limit_key, true, usage_value, limit_value, subscription_state.status, 'unlimited';
  elsif usage_value + safe_increment <= limit_value then
    return query select limit_key, true, usage_value, limit_value, subscription_state.status, 'within_limit';
  else
    return query select limit_key, false, usage_value, limit_value, subscription_state.status, 'limit_exceeded';
  end if;
end;
$$;

grant execute on function public.get_salon_subscription_status(uuid) to authenticated;
grant execute on function public.check_plan_limit(uuid, text, integer) to authenticated;

grant select on public.plans to anon, authenticated;
grant select on public.salon_subscriptions to authenticated;
grant select on public.subscription_events to authenticated;
grant select on public.usage_counters to authenticated;
