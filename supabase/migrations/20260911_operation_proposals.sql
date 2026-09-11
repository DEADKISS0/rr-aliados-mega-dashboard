create table if not exists public.operation_proposals (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('cash_movement')),
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'discarded', 'failed')),
  created_by text not null default 'ops',
  confirmed_by text,
  error_message text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);
create index if not exists operation_proposals_status_idx on public.operation_proposals (status, created_at desc);
alter table public.operation_proposals enable row level security;
