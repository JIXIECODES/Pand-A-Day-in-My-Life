-- Pand-A Day account data is stored as one versioned snapshot so the existing
-- local feature data model remains the single source of truth in the app.
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  data jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;
alter table public.user_data force row level security;

grant select, insert, update, delete on table public.user_data to authenticated;
revoke all on table public.user_data from anon;

drop policy if exists "Users can read their own panda data" on public.user_data;
create policy "Users can read their own panda data"
on public.user_data for select
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own panda data" on public.user_data;
create policy "Users can insert their own panda data"
on public.user_data for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own panda data" on public.user_data;
create policy "Users can update their own panda data"
on public.user_data for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own panda data" on public.user_data;
create policy "Users can delete their own panda data"
on public.user_data for delete
using ((select auth.uid()) = user_id);

create or replace function public.set_user_data_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_data_updated_at on public.user_data;
create trigger set_user_data_updated_at
before update on public.user_data
for each row execute function public.set_user_data_updated_at();