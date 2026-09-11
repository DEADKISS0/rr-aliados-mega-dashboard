create table if not exists public.supervisor_events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('error', 'decision', 'requirement')),
  title text not null,
  detail text,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  source text not null default 'unknown',
  decision text not null check (decision in ('auto_resolve', 'monitor', 'escalate')),
  decision_reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists supervisor_events_created_at_idx on public.supervisor_events (created_at desc);
alter table public.supervisor_events enable row level security;
