-- Koscherspiel Supabase Setup
-- Wichtig:
-- 1. Deaktiviere in Supabase unter Auth > Providers > Email die E-Mail-Bestätigung,
--    weil das Frontend Benutzernamen intern in synthetische E-Mail-Adressen umwandelt.
-- 2. Führe dieses Skript danach im SQL-Editor aus.

create or replace function public.koscher_league_from_score(input_score integer)
returns text
language sql
immutable
as $$
    select case
        when coalesce(input_score, 0) >= 170 then 'diamond'
        when coalesce(input_score, 0) >= 140 then 'obsidian'
        when coalesce(input_score, 0) >= 115 then 'pearl'
        when coalesce(input_score, 0) >= 90 then 'amethyst'
        when coalesce(input_score, 0) >= 70 then 'emerald'
        when coalesce(input_score, 0) >= 50 then 'ruby'
        when coalesce(input_score, 0) >= 35 then 'sapphire'
        when coalesce(input_score, 0) >= 20 then 'gold'
        when coalesce(input_score, 0) >= 10 then 'silver'
        else 'bronze'
    end;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    username text not null,
    highscore integer not null default 0 check (highscore >= 0),
    coins numeric(10,1) not null default 0 check (coins >= 0),
    unlocked_carts jsonb not null default '["classic"]'::jsonb,
    abilities jsonb not null default '{}'::jsonb,
    selected_cart text not null default 'classic',
    ultimate_cheat_enabled boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
    add column if not exists username text,
    add column if not exists highscore integer not null default 0,
    add column if not exists coins numeric(10,1) not null default 0,
    add column if not exists unlocked_carts jsonb not null default '["classic"]'::jsonb,
    add column if not exists abilities jsonb not null default '{}'::jsonb,
    add column if not exists selected_cart text not null default 'classic',
    add column if not exists ultimate_cheat_enabled boolean not null default false,
    add column if not exists created_at timestamptz not null default timezone('utc', now()),
    add column if not exists updated_at timestamptz not null default timezone('utc', now());

create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_koscher_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    normalized_username text;
begin
    normalized_username := lower(coalesce(new.raw_user_meta_data ->> 'username', ''));

    if normalized_username = '' or normalized_username !~ '^[a-z0-9._-]{3,20}$' then
        raise exception 'Username fehlt oder ist ungueltig.';
    end if;

    insert into public.profiles (id, username)
    values (new.id, normalized_username)
    on conflict (id) do update
    set username = excluded.username;

    return new;
end;
$$;

drop trigger if exists on_auth_koscher_user_created on auth.users;
create trigger on_auth_koscher_user_created
after insert on auth.users
for each row execute function public.handle_new_koscher_user();

create table if not exists public.leaderboard (
    user_id uuid,
    username text,
    score integer not null default 0 check (score >= 0),
    league_key text not null default 'bronze',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.leaderboard
    add column if not exists user_id uuid,
    add column if not exists username text,
    add column if not exists score integer not null default 0,
    add column if not exists league_key text not null default 'bronze',
    add column if not exists created_at timestamptz not null default timezone('utc', now()),
    add column if not exists updated_at timestamptz not null default timezone('utc', now());

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'leaderboard_user_id_fkey'
    ) then
        alter table public.leaderboard
            add constraint leaderboard_user_id_fkey
            foreign key (user_id) references public.profiles (id) on delete cascade;
    end if;
end;
$$;

create unique index if not exists leaderboard_user_id_idx on public.leaderboard (user_id);
create index if not exists leaderboard_league_score_idx on public.leaderboard (league_key, score desc);

do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
        and table_name = 'leaderboard'
        and column_name = 'name'
    ) then
        execute $sql$
            update public.leaderboard
            set username = coalesce(nullif(username, ''), nullif(name, ''), 'Anonym')
            where username is null or username = ''
        $sql$;
    else
        update public.leaderboard
        set username = 'Anonym'
        where username is null or username = '';
    end if;
end;
$$;

update public.leaderboard
set league_key = public.koscher_league_from_score(score)
where league_key is null or league_key = '';

drop trigger if exists leaderboard_touch_updated_at on public.leaderboard;
create trigger leaderboard_touch_updated_at
before update on public.leaderboard
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.leaderboard enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "leaderboard_select_public" on public.leaderboard;
create policy "leaderboard_select_public"
on public.leaderboard
for select
to anon, authenticated
using (true);

drop policy if exists "leaderboard_insert_own" on public.leaderboard;
create policy "leaderboard_insert_own"
on public.leaderboard
for insert
to authenticated
with check (
    auth.uid() = user_id
    and exists (
        select 1
        from public.profiles
        where profiles.id = auth.uid()
        and profiles.username = leaderboard.username
    )
);

drop policy if exists "leaderboard_update_own" on public.leaderboard;
create policy "leaderboard_update_own"
on public.leaderboard
for update
to authenticated
using (auth.uid() = user_id)
with check (
    auth.uid() = user_id
    and exists (
        select 1
        from public.profiles
        where profiles.id = auth.uid()
        and profiles.username = leaderboard.username
    )
);
