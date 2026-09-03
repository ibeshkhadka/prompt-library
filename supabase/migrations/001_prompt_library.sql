create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'member');
create type public.prompt_kind as enum ('text', 'image');
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'member',
  display_name text,
  created_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  color text not null default '#aeb7ff',
  created_at timestamptz not null default now()
);
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);
create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text not null default '',
  content text not null,
  category_id uuid references public.categories(id) on delete set null,
  prompt_type public.prompt_kind not null default 'text',
  tools text[] not null default '{}',
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_public boolean not null default false,
  is_archived boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.prompt_tags (
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (prompt_id, tag_id)
);
create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);
create index prompts_public_order_idx on public.prompts (is_public, is_archived, sort_order, updated_at desc);
create index prompts_category_idx on public.prompts (category_id);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger prompts_updated_at before update on public.prompts for each row execute procedure public.set_updated_at();
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.prompts enable row level security;
alter table public.prompt_tags enable row level security;
alter table public.favorites enable row level security;
create policy "public reads published prompts" on public.prompts for select using (is_public and not is_archived or public.is_admin());
create policy "admins manage prompts" on public.prompts for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads categories" on public.categories for select using (true);
create policy "admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads tags" on public.tags for select using (true);
create policy "admins manage tags" on public.tags for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads prompt tags" on public.prompt_tags for select using (true);
create policy "admins manage prompt tags" on public.prompt_tags for all using (public.is_admin()) with check (public.is_admin());
create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "users manage their favorites" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into public.categories (name, slug, color) values
  ('Writing','writing','#ff9e9e'),('Business','business','#aeb7ff'),('Creative','creative','#ffd95a'),('Image Studio','image-studio','#6ee7c1'),('Code','code','#b7e0ff'),('Growth','growth','#d7b5ff'),('Career','career','#ffc4df');
