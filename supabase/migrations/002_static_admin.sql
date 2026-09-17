-- Client-side admin support for static hosts such as GitHub Pages.
-- Add owner emails to this table directly in Supabase; no browser role can read it.
create table if not exists public.admin_allowlist (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

alter table public.admin_allowlist enable row level security;
revoke all on table public.admin_allowlist from anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    case
      when exists (
        select 1 from public.admin_allowlist
        where email = lower(new.email)
      ) then 'admin'::public.app_role
      else 'member'::public.app_role
    end
  );
  return new;
end;
$$;

alter type public.prompt_kind add value if not exists 'video';
