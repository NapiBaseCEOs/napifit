-- Assistant notifications table keeps AI assistant chatter + reminders in one place
create table if not exists public.assistant_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'assistant_chat',
  link text,
  metadata jsonb,
  dedupe_key text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_assistant_notifications_user_created
  on public.assistant_notifications (user_id, created_at desc);

create unique index if not exists uq_assistant_notifications_dedupe
  on public.assistant_notifications (user_id, dedupe_key)
  where dedupe_key is not null;

alter table public.assistant_notifications enable row level security;

create policy "users can view own assistant notifications"
  on public.assistant_notifications
  for select
  using (auth.uid() = user_id);

create policy "users can insert own assistant notifications"
  on public.assistant_notifications
  for insert
  with check (auth.uid() = user_id);

create policy "users can update own assistant notifications"
  on public.assistant_notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

