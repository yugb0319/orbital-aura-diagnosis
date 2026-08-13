create table if not exists public.diagnoses (
  diagnosis_id uuid primary key,
  created_at timestamptz not null default now(),
  main_type text not null,
  scores jsonb not null,
  personality jsonb,
  ability jsonb,
  ability_rating jsonb
);

alter table public.diagnoses enable row level security;
-- Public reads are deliberately served only through the server-side share route.
