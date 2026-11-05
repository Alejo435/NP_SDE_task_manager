-- tasks 
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  description text,
  status      text not null default 'todo'
              check (status in ('todo', 'in_progress', 'in_review', 'done')),
  priority    text not null default 'normal'
              check (priority in ('low', 'normal', 'high')),
  due_date    date,
  tags        text[] not null default '{}' check (cardinality(tags) <= 10),
  position    double precision not null default 0,
  created_at  timestamptz not null default now()
);

create index tasks_user_status_position_idx on public.tasks (user_id, status, position);

-- team members
create table public.team_members (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 50),
  color      text not null default '#7CC4FF' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at timestamptz not null default now()
);

create index team_members_user_idx on public.team_members (user_id);

-- task assignment
create table public.task_assignees (
  task_id   uuid not null references public.tasks(id) on delete cascade,
  member_id uuid not null references public.team_members(id) on delete cascade,
  primary key (task_id, member_id)
);

create index task_assignees_member_idx on public.task_assignees (member_id);


-- RLS
alter table public.tasks          enable row level security;
alter table public.team_members   enable row level security;
alter table public.task_assignees enable row level security;

-- tasks - full access to own rows only
create policy "tasks_own" on public.tasks
  for all to authenticated
  using      ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- team members - full access to own rows only
create policy "team_members_own" on public.team_members
  for all to authenticated
  using      ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- assignees - visible/deletable if the task is yours
create policy "assignees_select_own" on public.task_assignees
  for select to authenticated
  using (exists (
    select 1 from public.tasks t
    where t.id = task_id and t.user_id = (select auth.uid())
  ));

create policy "assignees_delete_own" on public.task_assignees
  for delete to authenticated
  using (exists (
    select 1 from public.tasks t
    where t.id = task_id and t.user_id = (select auth.uid())
  ));

-- assignees - user can only link their task to their team member
create policy "assignees_insert_own" on public.task_assignees
  for insert to authenticated
  with check (
    exists (select 1 from public.tasks t
            where t.id = task_id and t.user_id = (select auth.uid()))
    and
    exists (select 1 from public.team_members m
            where m.id = member_id and m.user_id = (select auth.uid()))
  );
