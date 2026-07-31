-- TramitoFácil: persistent storage for uploaded documents + validation history.
-- Run this against your Supabase project (SQL Editor, or `supabase db push`
-- if you're using the Supabase CLI locally).

-- 1. Private bucket for uploaded document photos.
-- Not public: files are only reachable via signed URLs or by the owner,
-- enforced by the storage policies below.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- 2. Table recording each validation run (one row per uploaded file).
create table if not exists public.document_validations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  procedure_id text not null,
  document_id text not null,
  filename text not null,
  storage_path text not null,
  status text not null check (status in ('accepted', 'needs_review', 'rejected')),
  notes text not null,
  demo boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists document_validations_user_id_idx
  on public.document_validations (user_id, created_at desc);

alter table public.document_validations enable row level security;

-- Users can only ever see / insert / delete their own rows. There's no
-- update policy on purpose — validation results are immutable once written.
create policy "Users can view their own validations"
  on public.document_validations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own validations"
  on public.document_validations for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own validations"
  on public.document_validations for delete
  using (auth.uid() = user_id);

-- 3. Storage policies: files live under `{user_id}/...` inside the
-- `documents` bucket, so we can enforce ownership by checking that the
-- first path segment matches the caller's uid.
create policy "Users can upload their own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can read their own documents"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
