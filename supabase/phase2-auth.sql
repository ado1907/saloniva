-- Saloniva phase 2: real auth + salon account bootstrap
-- Run this after supabase/schema.sql.

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
    coalesce(nullif(trim(salon_name_input), ''), 'Yeni Salon'),
    final_slug,
    coalesce(nullif(trim(owner_name_input), ''), 'Salon Yetkilisi'),
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
