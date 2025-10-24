-- Create app_role enum for app-level permissions
create type public.app_role as enum ('super_admin', 'admin', 'user');

-- Create user_roles table for app-level roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz default now(),
  unique (user_id, role)
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Create security definer function to check app-level roles
create or replace function public.has_app_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS Policies for user_roles
create policy "Users can view their own roles"
on public.user_roles
for select
using (auth.uid() = user_id);

create policy "Super admins can manage all roles"
on public.user_roles
for all
using (public.has_app_role(auth.uid(), 'super_admin'));

-- Add index for performance
create index idx_user_roles_user_id on public.user_roles(user_id);
create index idx_user_roles_role on public.user_roles(role);