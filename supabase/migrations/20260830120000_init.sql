create type public.business_role as enum ('owner', 'admin', 'staff');

create type public.subscription_plan as enum ('start', 'business', 'pro');

create type public.subscription_status as enum (
  'trialing',
  'active',
  'past_due',
  'canceled'
);

create type public.booking_status as enum (
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show'
);

create type public.channel as enum ('instagram', 'whatsapp', 'web');

create type public.conversation_status as enum ('open', 'handoff', 'closed');

create type public.message_author as enum ('customer', 'assistant', 'human');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'),
  phone text check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  email text,
  address text,
  timezone text not null default 'Asia/Tbilisi',
  plan public.subscription_plan not null default 'start',
  subscription_status public.subscription_status not null default 'trialing',
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.users_businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  role public.business_role not null default 'staff',
  created_at timestamptz not null default now(),
  unique (user_id, business_id)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  description text,
  duration_minutes integer not null check (duration_minutes > 0),
  price_tetri integer not null check (price_tetri >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null check (length(btrim(full_name)) > 0),
  phone text check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  full_name text not null check (length(btrim(full_name)) > 0),
  phone text check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, phone)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  client_id uuid references public.clients (id) on delete set null,
  service_id uuid references public.services (id) on delete restrict,
  staff_id uuid references public.staff (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.booking_status not null default 'pending',
  price_tetri integer check (price_tetri >= 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  client_id uuid references public.clients (id) on delete set null,
  channel public.channel not null,
  external_id text not null,
  status public.conversation_status not null default 'open',
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, channel, external_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  author public.message_author not null,
  content text not null,
  model text,
  tokens_in integer check (tokens_in >= 0),
  tokens_out integer check (tokens_out >= 0),
  created_at timestamptz not null default now()
);

create index users_businesses_business_id_idx on public.users_businesses (business_id);
create index users_businesses_user_id_idx on public.users_businesses (user_id);
create index services_business_id_idx on public.services (business_id);
create index staff_business_id_idx on public.staff (business_id);
create index clients_business_id_idx on public.clients (business_id);
create index bookings_business_id_starts_at_idx on public.bookings (business_id, starts_at);
create index bookings_staff_id_starts_at_idx on public.bookings (staff_id, starts_at);
create index conversations_business_id_last_message_at_idx on public.conversations (business_id, last_message_at desc);
create index messages_conversation_id_created_at_idx on public.messages (conversation_id, created_at);
create index messages_business_id_idx on public.messages (business_id);

create trigger businesses_set_updated_at before update on public.businesses
  for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services
  for each row execute function public.set_updated_at();
create trigger staff_set_updated_at before update on public.staff
  for each row execute function public.set_updated_at();
create trigger clients_set_updated_at before update on public.clients
  for each row execute function public.set_updated_at();
create trigger bookings_set_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations
  for each row execute function public.set_updated_at();

-- security definer so policies on users_businesses can call it without
-- re-entering that table's own RLS policy (infinite recursion).
create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.users_businesses ub
    where ub.business_id = target_business_id
      and ub.user_id = (select auth.uid())
  );
$$;

create or replace function public.is_business_admin(target_business_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.users_businesses ub
    where ub.business_id = target_business_id
      and ub.user_id = (select auth.uid())
      and ub.role in ('owner', 'admin')
  );
$$;

revoke execute on function public.is_business_member(uuid) from public, anon;
revoke execute on function public.is_business_admin(uuid) from public, anon;
grant execute on function public.is_business_member(uuid) to authenticated;
grant execute on function public.is_business_admin(uuid) to authenticated;

alter table public.businesses enable row level security;
alter table public.users_businesses enable row level security;
alter table public.services enable row level security;
alter table public.staff enable row level security;
alter table public.clients enable row level security;
alter table public.bookings enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy businesses_select on public.businesses
  for select to authenticated
  using (public.is_business_member(id));

create policy businesses_update on public.businesses
  for update to authenticated
  using (public.is_business_admin(id))
  with check (public.is_business_admin(id));

create policy businesses_delete on public.businesses
  for delete to authenticated
  using (public.is_business_admin(id));

-- Membership rows are managed by existing admins only. The first owner row of
-- a brand-new business is created by onboarding through the service role, so
-- there is deliberately no self-insert path here.
create policy users_businesses_select on public.users_businesses
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_business_member(business_id));

create policy users_businesses_insert on public.users_businesses
  for insert to authenticated
  with check (public.is_business_admin(business_id));

create policy users_businesses_update on public.users_businesses
  for update to authenticated
  using (public.is_business_admin(business_id))
  with check (public.is_business_admin(business_id));

create policy users_businesses_delete on public.users_businesses
  for delete to authenticated
  using (public.is_business_admin(business_id));

create policy services_all on public.services
  for all to authenticated
  using (public.is_business_member(business_id))
  with check (public.is_business_member(business_id));

create policy staff_all on public.staff
  for all to authenticated
  using (public.is_business_member(business_id))
  with check (public.is_business_member(business_id));

create policy clients_all on public.clients
  for all to authenticated
  using (public.is_business_member(business_id))
  with check (public.is_business_member(business_id));

create policy bookings_all on public.bookings
  for all to authenticated
  using (public.is_business_member(business_id))
  with check (public.is_business_member(business_id));

create policy conversations_all on public.conversations
  for all to authenticated
  using (public.is_business_member(business_id))
  with check (public.is_business_member(business_id));

create policy messages_all on public.messages
  for all to authenticated
  using (public.is_business_member(business_id))
  with check (public.is_business_member(business_id));
