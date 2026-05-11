-- Saloniva Supabase starter schema
-- Run this in Supabase SQL Editor after creating a new project.

create extension if not exists "pgcrypto";

create table if not exists public.salons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_name text not null,
  plan_id text not null default 'starter',
  subscription_status text not null default 'Deneme',
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.salon_members (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('Salon Sahibi', 'Yönetici', 'Personel')),
  created_at timestamptz not null default now(),
  unique (salon_id, user_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  name text not null,
  phone text not null,
  last_visit text,
  total_spent numeric not null default 0,
  debt numeric not null default 0,
  package_label text not null default 'Aktif paket yok',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  customer_name text not null,
  phone text not null,
  service_name text not null,
  staff_name text not null,
  starts_at text not null,
  ends_at text not null,
  price numeric not null default 0,
  status text not null default 'Planlandı',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_packages (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  customer_name text not null,
  title text not null,
  total_sessions integer not null default 0,
  used_sessions integer not null default 0,
  total_price numeric not null default 0,
  paid numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  customer_name text not null,
  service_name text not null,
  paid_at text not null,
  amount numeric not null default 0,
  method text not null,
  status text not null,
  remaining numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.salon_services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  name text not null,
  category text not null,
  duration_minutes integer not null default 60,
  price numeric not null default 0,
  active boolean not null default true,
  staff text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  name text not null,
  role text not null,
  phone text not null,
  active boolean not null default true,
  services text[] not null default '{}',
  appointments_today integer not null default 0,
  monthly_revenue numeric not null default 0,
  next_appointment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  name text not null,
  category text not null,
  quantity numeric not null default 0,
  unit text not null,
  min_quantity numeric not null default 0,
  cost numeric not null default 0,
  supplier text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  customer_name text not null,
  phone text not null,
  service_name text not null,
  preferred_time text not null,
  note text,
  status text not null default 'Onay Bekliyor',
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create or replace function public.is_salon_member(target_salon_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.salon_members member
    where member.salon_id = target_salon_id
      and member.user_id = auth.uid()
  );
$$;

create or replace function public.has_salon_role(target_salon_id uuid, allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.salon_members member
    where member.salon_id = target_salon_id
      and member.user_id = auth.uid()
      and member.role = any(allowed_roles)
  );
$$;

alter table public.salons enable row level security;
alter table public.salon_members enable row level security;
alter table public.customers enable row level security;
alter table public.appointments enable row level security;
alter table public.service_packages enable row level security;
alter table public.payments enable row level security;
alter table public.salon_services enable row level security;
alter table public.staff_members enable row level security;
alter table public.inventory_items enable row level security;
alter table public.booking_requests enable row level security;
alter table public.audit_logs enable row level security;

create policy "members can read own salons" on public.salons
  for select using (public.is_salon_member(id));

create policy "owners can update own salons" on public.salons
  for update using (public.has_salon_role(id, array['Salon Sahibi']));

create policy "members can read salon membership" on public.salon_members
  for select using (public.is_salon_member(salon_id));

create policy "owners can manage salon membership" on public.salon_members
  for all using (public.has_salon_role(salon_id, array['Salon Sahibi']))
  with check (public.has_salon_role(salon_id, array['Salon Sahibi']));

create policy "members can read customers" on public.customers
  for select using (public.is_salon_member(salon_id));
create policy "staff can write customers" on public.customers
  for all using (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici','Personel']))
  with check (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici','Personel']));

create policy "members can read appointments" on public.appointments
  for select using (public.is_salon_member(salon_id));
create policy "staff can write appointments" on public.appointments
  for all using (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici','Personel']))
  with check (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici','Personel']));

create policy "members can read packages" on public.service_packages
  for select using (public.is_salon_member(salon_id));
create policy "staff can write packages" on public.service_packages
  for all using (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici','Personel']))
  with check (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici','Personel']));

create policy "managers can read payments" on public.payments
  for select using (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici']));
create policy "managers can write payments" on public.payments
  for all using (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici']))
  with check (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici']));

create policy "members can read services" on public.salon_services
  for select using (public.is_salon_member(salon_id));
create policy "managers can write services" on public.salon_services
  for all using (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici']))
  with check (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici']));

create policy "members can read staff" on public.staff_members
  for select using (public.is_salon_member(salon_id));
create policy "managers can write staff" on public.staff_members
  for all using (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici']))
  with check (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici']));

create policy "members can read inventory" on public.inventory_items
  for select using (public.is_salon_member(salon_id));
create policy "managers can write inventory" on public.inventory_items
  for all using (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici']))
  with check (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici']));

create policy "members can read booking requests" on public.booking_requests
  for select using (public.is_salon_member(salon_id));
create policy "staff can manage booking requests" on public.booking_requests
  for all using (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici','Personel']))
  with check (public.has_salon_role(salon_id, array['Salon Sahibi','Yönetici','Personel']));

create policy "owners can read audit logs" on public.audit_logs
  for select using (public.has_salon_role(salon_id, array['Salon Sahibi']));
create policy "members can create audit logs" on public.audit_logs
  for insert with check (public.is_salon_member(salon_id));

create or replace function public.slugify_salon_name(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(input, 'salon')), '[^a-z0-9]+', '-', 'g'));
$$;

create or replace function public.register_salon_account(
  salon_name_input text,
  owner_name_input text,
  role_input text default 'Salon Sahibi',
  plan_id_input text default 'starter'
)
returns table (
  salon_id uuid,
  salon_name text,
  owner_name text,
  email text,
  role text,
  plan_id text,
  subscription_status text,
  trial_ends_at text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  new_salon_id uuid;
  base_slug text;
  final_slug text;
  current_user_email text;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  current_user_email := coalesce(auth.jwt() ->> 'email', '');
  base_slug := public.slugify_salon_name(salon_name_input);
  final_slug := base_slug || '-' || substring(auth.uid()::text from 1 for 8);

  insert into public.salons (name, slug, owner_name, plan_id, subscription_status, trial_ends_at)
  values (
    nullif(trim(salon_name_input), ''),
    final_slug,
    nullif(trim(owner_name_input), ''),
    plan_id_input,
    'Deneme',
    now() + interval '14 days'
  )
  returning id into new_salon_id;

  insert into public.salon_members (salon_id, user_id, role)
  values (
    new_salon_id,
    auth.uid(),
    case when role_input in ('Salon Sahibi', 'Yönetici', 'Personel') then role_input else 'Salon Sahibi' end
  );

  insert into public.audit_logs (salon_id, actor_user_id, action, table_name, record_id, metadata)
  values (
    new_salon_id,
    auth.uid(),
    'salon_registered',
    'salons',
    new_salon_id::text,
    jsonb_build_object('source', 'supabase_auth')
  );

  return query
  select
    salons.id,
    salons.name,
    salons.owner_name,
    current_user_email,
    salon_members.role,
    salons.plan_id,
    salons.subscription_status,
    to_char(salons.trial_ends_at, 'DD.MM.YYYY')
  from public.salons
  join public.salon_members on salon_members.salon_id = salons.id
  where salons.id = new_salon_id
    and salon_members.user_id = auth.uid();
end;
$$;

create or replace function public.get_my_salon_account()
returns table (
  salon_id uuid,
  salon_name text,
  owner_name text,
  email text,
  role text,
  plan_id text,
  subscription_status text,
  trial_ends_at text
)
language sql
security definer
set search_path = public
as $$
  select
    salons.id,
    salons.name,
    salons.owner_name,
    coalesce(auth.jwt() ->> 'email', ''),
    salon_members.role,
    salons.plan_id,
    salons.subscription_status,
    to_char(salons.trial_ends_at, 'DD.MM.YYYY')
  from public.salons
  join public.salon_members on salon_members.salon_id = salons.id
  where salon_members.user_id = auth.uid()
  order by salon_members.created_at asc
  limit 1;
$$;

grant execute on function public.register_salon_account(text, text, text, text) to authenticated;
grant execute on function public.get_my_salon_account() to authenticated;
