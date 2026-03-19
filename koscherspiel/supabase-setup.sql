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
    -- Punktbasierte Liga-Zuordnung wurde entfernt:
    -- Score allein darf keinen Auf-/Abstieg mehr ausloesen.
    select 'silver'::text;
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

create or replace function public.koscher_cycle_length_seconds()
returns bigint
language sql
immutable
as $$
    select 259200::bigint;
$$;

create or replace function public.koscher_current_cycle_id(at_time timestamptz default timezone('utc', now()))
returns bigint
language sql
stable
as $$
    select floor(extract(epoch from coalesce(at_time, timezone('utc', now()))) / public.koscher_cycle_length_seconds())::bigint;
$$;

create or replace function public.koscher_cycle_ends_at(input_cycle_id bigint default public.koscher_current_cycle_id())
returns timestamptz
language sql
stable
as $$
    select to_timestamp((coalesce(input_cycle_id, public.koscher_current_cycle_id()) + 1) * public.koscher_cycle_length_seconds());
$$;

create or replace function public.koscher_next_league(current_league text)
returns text
language sql
immutable
as $$
    select case coalesce(current_league, 'bronze')
        when 'bronze' then 'silver'
        when 'silver' then 'gold'
        when 'gold' then 'sapphire'
        when 'sapphire' then 'ruby'
        when 'ruby' then 'emerald'
        when 'emerald' then 'amethyst'
        when 'amethyst' then 'pearl'
        when 'pearl' then 'obsidian'
        when 'obsidian' then 'diamond'
        else 'diamond'
    end;
$$;

create or replace function public.koscher_previous_league(current_league text)
returns text
language sql
immutable
as $$
    select case coalesce(current_league, 'bronze')
        when 'diamond' then 'obsidian'
        when 'obsidian' then 'pearl'
        when 'pearl' then 'amethyst'
        when 'amethyst' then 'emerald'
        when 'emerald' then 'ruby'
        when 'ruby' then 'sapphire'
        when 'sapphire' then 'gold'
        when 'gold' then 'silver'
        when 'silver' then 'bronze'
        else 'bronze'
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
    league_key text not null default 'silver',
    league_group integer not null default 1 check (league_group >= 1),
    league_cycle_id bigint not null default 0,
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
    add column if not exists league_key text not null default 'silver',
    add column if not exists league_group integer not null default 1,
    add column if not exists league_cycle_id bigint not null default 0,
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

    insert into public.profiles (id, username, league_key, league_group, league_cycle_id)
    values (new.id, normalized_username, 'silver', 1, public.koscher_current_cycle_id())
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
    league_key text not null default 'silver',
    league_group integer not null default 1 check (league_group >= 1),
    cycle_id bigint not null default 0,
    is_guest boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.leaderboard
    add column if not exists user_id uuid,
    add column if not exists username text,
    add column if not exists score integer not null default 0,
    add column if not exists league_key text not null default 'silver',
    add column if not exists league_group integer not null default 1,
    add column if not exists cycle_id bigint not null default 0,
    add column if not exists is_guest boolean not null default false,
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

drop index if exists public.leaderboard_user_id_idx;

with ranked_duplicate_rows as (
    select
        ctid,
        row_number() over (
            partition by user_id, cycle_id
            order by score desc, updated_at desc, created_at desc, ctid desc
        ) as duplicate_rank
    from public.leaderboard
    where user_id is not null
      and is_guest = false
)
delete from public.leaderboard as lb
using ranked_duplicate_rows as ranked
where lb.ctid = ranked.ctid
  and ranked.duplicate_rank > 1;

create unique index if not exists leaderboard_user_cycle_unique_idx
on public.leaderboard (user_id, cycle_id)
where user_id is not null and is_guest = false;

create index if not exists leaderboard_cycle_league_idx
on public.leaderboard (cycle_id, league_key, league_group, score desc);

create index if not exists leaderboard_guest_cycle_idx
on public.leaderboard (cycle_id, score desc)
where is_guest = true;

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

with seeded_profiles as (
    select
        p.id,
        p.highscore,
        coalesce(
            nullif(p.league_key, ''),
            latest_entry.league_key,
            'silver'
        ) as target_league
    from public.profiles p
    left join lateral (
        select lb.league_key
        from public.leaderboard lb
        where lb.user_id = p.id
        order by lb.score desc, lb.updated_at desc
        limit 1
    ) latest_entry on true
), ranked_profiles as (
    select
        id,
        target_league,
        ((row_number() over (partition by target_league order by highscore desc, id) - 1) / 20) + 1 as target_group
    from seeded_profiles
)
update public.profiles p
set league_key = ranked_profiles.target_league,
    league_group = ranked_profiles.target_group,
    league_cycle_id = public.koscher_current_cycle_id()
from ranked_profiles
where p.id = ranked_profiles.id;

with current_profile_rows as (
    select distinct on (lb.user_id)
        lb.ctid as row_ctid,
        lb.user_id
    from public.leaderboard lb
    where lb.user_id is not null
    order by
        lb.user_id,
        (lb.cycle_id = public.koscher_current_cycle_id()) desc,
        lb.score desc,
        lb.updated_at desc,
        lb.created_at desc,
        lb.ctid desc
)
update public.leaderboard lb
set username = coalesce(nullif(lb.username, ''), p.username, 'Anonym'),
    league_key = p.league_key,
    league_group = p.league_group,
    cycle_id = public.koscher_current_cycle_id(),
    is_guest = false
from public.profiles p
join current_profile_rows selected on selected.user_id = p.id
where lb.ctid = selected.row_ctid;

update public.leaderboard
set username = coalesce(nullif(username, ''), 'Anonym'),
    league_key = 'guest',
    league_group = 1,
    cycle_id = public.koscher_current_cycle_id(),
    is_guest = true
where user_id is null;

insert into public.leaderboard (user_id, username, score, league_key, league_group, cycle_id, is_guest)
select p.id, p.username, 0, p.league_key, p.league_group, p.league_cycle_id, false
from public.profiles p
where not exists (
    select 1
    from public.leaderboard lb
    where lb.user_id = p.id
      and lb.cycle_id = p.league_cycle_id
);

drop trigger if exists leaderboard_touch_updated_at on public.leaderboard;
create trigger leaderboard_touch_updated_at
before update on public.leaderboard
for each row execute function public.touch_updated_at();

create or replace function public.koscher_pick_group(target_league text, target_cycle bigint)
returns integer
language plpgsql
stable
as $$
declare
    selected_group integer;
begin
    if coalesce(target_league, '') = 'guest' then
        return 1;
    end if;

    select candidate.league_group
    into selected_group
    from (
        select league_group, count(*) as member_count
        from public.profiles
        where league_key = target_league
          and league_cycle_id = target_cycle
        group by league_group
        having count(*) < 20
        order by count(*) asc, league_group asc
        limit 1
    ) candidate;

    if selected_group is not null then
        return selected_group;
    end if;

    select coalesce(max(league_group), 0) + 1
    into selected_group
    from public.profiles
    where league_key = target_league
      and league_cycle_id = target_cycle;

    return greatest(coalesce(selected_group, 1), 1);
end;
$$;

create or replace function public.koscher_cleanup_guest_league()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    delete from public.leaderboard
    where is_guest = true
      and cycle_id < public.koscher_current_cycle_id();
end;
$$;

create or replace function public.koscher_ensure_profile_league(target_user_id uuid default auth.uid())
returns table (
    league_key text,
    league_group integer,
    cycle_id bigint,
    cycle_ends_at timestamptz,
    username text
)
language plpgsql
security definer
set search_path = public
as $$
declare
    profile_row public.profiles%rowtype;
    current_cycle bigint := public.koscher_current_cycle_id();
    target_league text;
    target_group integer;
    previous_rank integer;
    previous_member_count integer;
    movement_slots integer;
    demotion_start_rank integer;
begin
    if target_user_id is null then
        raise exception 'Kein angemeldeter Nutzer vorhanden.';
    end if;

    select p.*
    into profile_row
    from public.profiles as p
    where p.id = target_user_id;

    if not found then
        raise exception 'Profil nicht gefunden.';
    end if;

    if coalesce(profile_row.league_cycle_id, 0) = current_cycle
       and coalesce(profile_row.league_key, '') <> ''
       and coalesce(profile_row.league_group, 0) > 0 then
        update public.leaderboard as lb
        set username = profile_row.username,
            league_key = profile_row.league_key,
            league_group = profile_row.league_group,
            cycle_id = current_cycle,
            is_guest = false
        where lb.user_id = profile_row.id
          and lb.cycle_id = current_cycle;

        if not found then
            insert into public.leaderboard (user_id, username, score, league_key, league_group, cycle_id, is_guest)
            values (profile_row.id, profile_row.username, 0, profile_row.league_key, profile_row.league_group, current_cycle, false);
        end if;

        return query
        select profile_row.league_key, profile_row.league_group, current_cycle, public.koscher_cycle_ends_at(current_cycle), profile_row.username;
        return;
    end if;

    target_league := coalesce(nullif(profile_row.league_key, ''), 'silver');

    if coalesce(profile_row.league_cycle_id, 0) > 0 then
        select ranked.rank_position, ranked.member_count
        into previous_rank, previous_member_count
        from (
            select
                lb.user_id,
                row_number() over (
                    order by lb.score desc, lb.updated_at asc, lb.username asc, coalesce(lb.user_id::text, '')
                ) as rank_position,
                count(*) over () as member_count
            from public.leaderboard as lb
            where lb.cycle_id = profile_row.league_cycle_id
              and lb.league_key = target_league
              and lb.league_group = greatest(coalesce(profile_row.league_group, 1), 1)
              and lb.is_guest = false
        ) ranked
        where ranked.user_id = profile_row.id;

        if coalesce(previous_member_count, 0) > 0 then
            movement_slots := least(5, greatest(previous_member_count, 0));
            demotion_start_rank := greatest(previous_member_count - movement_slots + 1, 1);

            if coalesce(previous_rank, 9999) <= movement_slots then
                target_league := public.koscher_next_league(target_league);
            elsif previous_rank >= demotion_start_rank then
                target_league := public.koscher_previous_league(target_league);
            end if;
        end if;
    end if;

    target_group := public.koscher_pick_group(target_league, current_cycle);

    update public.profiles as p
    set league_key = target_league,
        league_group = target_group,
        league_cycle_id = current_cycle,
        updated_at = timezone('utc', now())
    where p.id = profile_row.id
    returning *
    into profile_row;

    update public.leaderboard as lb
    set username = profile_row.username,
        score = 0,
        league_key = profile_row.league_key,
        league_group = profile_row.league_group,
        cycle_id = current_cycle,
        is_guest = false
    where lb.user_id = profile_row.id
      and lb.cycle_id = current_cycle;

    if not found then
        insert into public.leaderboard (user_id, username, score, league_key, league_group, cycle_id, is_guest)
        values (profile_row.id, profile_row.username, 0, profile_row.league_key, profile_row.league_group, current_cycle, false);
    end if;

    return query
    select profile_row.league_key, profile_row.league_group, current_cycle, public.koscher_cycle_ends_at(current_cycle), profile_row.username;
end;
$$;

create or replace function public.koscher_get_my_league_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    current_league record;
    league_entries jsonb;
begin
    select *
    into current_league
    from public.koscher_ensure_profile_league(auth.uid());

    select coalesce(
        jsonb_agg(
            jsonb_build_object(
                'rank', ranked.rank_position,
                'username', ranked.username,
                'score', ranked.score,
                'user_id', ranked.user_id,
                'is_current_user', ranked.user_id = auth.uid()
            )
            order by ranked.rank_position
        ),
        '[]'::jsonb
    )
    into league_entries
    from (
        select
            row_number() over (
                order by score desc, updated_at asc, username asc, coalesce(user_id::text, '')
            ) as rank_position,
            user_id,
            username,
            score
        from public.leaderboard
        where cycle_id = current_league.cycle_id
          and league_key = current_league.league_key
          and league_group = current_league.league_group
          and is_guest = false
        order by score desc, updated_at asc, username asc, coalesce(user_id::text, '')
        limit 20
    ) ranked;

    return jsonb_build_object(
        'guest', false,
        'leagueKey', current_league.league_key,
        'leagueGroup', current_league.league_group,
        'cycleId', current_league.cycle_id,
        'cycleEndsAt', current_league.cycle_ends_at,
        'entries', league_entries
    );
end;
$$;

create or replace function public.koscher_submit_authenticated_score(input_score integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    current_league record;
    normalized_score integer := greatest(coalesce(input_score, 0), 0);
begin
    select *
    into current_league
    from public.koscher_ensure_profile_league(auth.uid());

    update public.leaderboard
    set score = greatest(score, normalized_score),
        username = current_league.username,
        league_key = current_league.league_key,
        league_group = current_league.league_group,
        cycle_id = current_league.cycle_id,
        is_guest = false,
        updated_at = timezone('utc', now())
    where user_id = auth.uid()
      and cycle_id = current_league.cycle_id;

    if not found then
        insert into public.leaderboard (user_id, username, score, league_key, league_group, cycle_id, is_guest)
        values (auth.uid(), current_league.username, normalized_score, current_league.league_key, current_league.league_group, current_league.cycle_id, false);
    end if;

    return public.koscher_get_my_league_snapshot();
end;
$$;

create or replace function public.koscher_get_guest_league_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    current_cycle bigint := public.koscher_current_cycle_id();
    guest_entries jsonb;
begin
    perform public.koscher_cleanup_guest_league();

    select coalesce(
        jsonb_agg(
            jsonb_build_object(
                'rank', ranked.rank_position,
                'username', ranked.username,
                'score', ranked.score,
                'is_current_user', false
            )
            order by ranked.rank_position
        ),
        '[]'::jsonb
    )
    into guest_entries
    from (
        select
            row_number() over (
                order by score desc, updated_at asc, username asc, created_at asc
            ) as rank_position,
            username,
            score
        from public.leaderboard
        where cycle_id = current_cycle
          and is_guest = true
          and league_key = 'guest'
        order by score desc, updated_at asc, username asc, created_at asc
        limit 20
    ) ranked;

    return jsonb_build_object(
        'guest', true,
        'leagueKey', 'guest',
        'leagueGroup', 1,
        'cycleId', current_cycle,
        'cycleEndsAt', public.koscher_cycle_ends_at(current_cycle),
        'entries', guest_entries
    );
end;
$$;

create or replace function public.koscher_submit_guest_score(input_username text, input_score integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    current_cycle bigint := public.koscher_current_cycle_id();
    normalized_name text := left(trim(regexp_replace(coalesce(input_username, 'Anonym'), '[<>]', '', 'g')), 20);
    normalized_score integer := greatest(coalesce(input_score, 0), 0);
begin
    perform public.koscher_cleanup_guest_league();

    if normalized_name = '' then
        normalized_name := 'Anonym';
    end if;

    update public.leaderboard
    set score = greatest(score, normalized_score),
        username = normalized_name,
        league_key = 'guest',
        league_group = 1,
        cycle_id = current_cycle,
        is_guest = true,
        updated_at = timezone('utc', now())
    where is_guest = true
      and cycle_id = current_cycle
      and lower(username) = lower(normalized_name);

    if not found then
        insert into public.leaderboard (user_id, username, score, league_key, league_group, cycle_id, is_guest)
        values (null, normalized_name, normalized_score, 'guest', 1, current_cycle, true);
    end if;

    return public.koscher_get_guest_league_snapshot();
end;
$$;


create or replace function public.koscher_force_league_rotation()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    caller_role text := coalesce(auth.jwt() ->> 'role', current_setting('role', true));
    destination_cycle bigint := public.koscher_current_cycle_id();
    source_cycle bigint := public.koscher_current_cycle_id() - 1;
    moved_count integer := 0;
    group_row record;
    ranked_row record;
    movement_slots integer;
    demotion_start_rank integer;
    target_league text;
    target_group integer;
begin
    if caller_role not in ('service_role', 'supabase_admin', 'postgres') then
        raise exception 'Nur Service-Rollen duerfen den Ligawechsel erzwingen.';
    end if;

    if source_cycle < 0 then
        return jsonb_build_object(
            'sourceCycleId', source_cycle,
            'cycleId', destination_cycle,
            'movedProfiles', 0
        );
    end if;

    for group_row in
        select
            lb.league_key,
            lb.league_group,
            count(*)::integer as member_count
        from public.leaderboard lb
        where lb.cycle_id = source_cycle
          and lb.is_guest = false
          and lb.user_id is not null
        group by lb.league_key, lb.league_group
    loop
        movement_slots := least(5, greatest(group_row.member_count, 0));
        demotion_start_rank := greatest(group_row.member_count - movement_slots + 1, 1);

        for ranked_row in
            select
                ranked.user_id,
                ranked.rank_position
            from (
                select
                    lb.user_id,
                    row_number() over (
                        order by lb.score desc, lb.updated_at asc, lb.user_id asc
                    ) as rank_position
                from public.leaderboard lb
                where lb.cycle_id = source_cycle
                  and lb.is_guest = false
                  and lb.user_id is not null
                  and lb.league_key = group_row.league_key
                  and lb.league_group = group_row.league_group
            ) ranked
            where ranked.rank_position <= movement_slots
               or ranked.rank_position >= demotion_start_rank
        loop
            target_league := group_row.league_key;

            if ranked_row.rank_position <= movement_slots then
                target_league := public.koscher_next_league(target_league);
            elsif ranked_row.rank_position >= demotion_start_rank then
                target_league := public.koscher_previous_league(target_league);
            end if;

            if target_league <> group_row.league_key then
                target_group := public.koscher_pick_group(target_league, destination_cycle);

                update public.profiles
                set league_key = target_league,
                    league_group = target_group,
                    league_cycle_id = destination_cycle,
                    updated_at = timezone('utc', now())
                where id = ranked_row.user_id;

                update public.leaderboard
                set league_key = target_league,
                    league_group = target_group,
                    score = 0,
                    updated_at = timezone('utc', now())
                where user_id = ranked_row.user_id
                  and cycle_id = destination_cycle
                  and is_guest = false;

                moved_count := moved_count + 1;
            end if;
        end loop;
    end loop;

    return jsonb_build_object(
        'sourceCycleId', source_cycle,
        'cycleId', destination_cycle,
        'movedProfiles', moved_count
    );
end;
$$;

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
drop policy if exists "leaderboard_insert_own" on public.leaderboard;
drop policy if exists "leaderboard_update_own" on public.leaderboard;
drop policy if exists "leaderboard_select_own" on public.leaderboard;

create policy "leaderboard_select_own"
on public.leaderboard
for select
to authenticated
using (auth.uid() = user_id);

create policy "leaderboard_insert_own"
on public.leaderboard
for insert
to authenticated
with check (
    auth.uid() = user_id
    and is_guest = false
);

create policy "leaderboard_update_own"
on public.leaderboard
for update
to authenticated
using (auth.uid() = user_id)
with check (
    auth.uid() = user_id
    and is_guest = false
);

grant execute on function public.koscher_get_guest_league_snapshot() to anon, authenticated;
grant execute on function public.koscher_submit_guest_score(text, integer) to anon, authenticated;
grant execute on function public.koscher_get_my_league_snapshot() to authenticated;
grant execute on function public.koscher_submit_authenticated_score(integer) to authenticated;
grant execute on function public.koscher_ensure_profile_league(uuid) to authenticated;
revoke execute on function public.koscher_force_league_rotation() from anon, authenticated;
grant execute on function public.koscher_force_league_rotation() to service_role;
