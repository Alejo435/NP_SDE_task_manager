-- Tasks creation
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

-- team mem creation
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