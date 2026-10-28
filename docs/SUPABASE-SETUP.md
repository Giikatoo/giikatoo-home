```sql
create table public.letters (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null default 'OWNER_USER_ID'::uuid references auth.users(id),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now(),
  is_read boolean not null default false,
);

alter table public.letters enable row level security;

create policy "Anyone can create a letter"
on public.letters
for insert
to anon, authenticated
with check (
  recipient_id = 'OWNER_USER_ID'::uuid
  and char_length(message) between 1 and 500
);

create policy "Only the owner can read letters"
on public.letters
for select
to authenticated
using (auth.uid() = recipient_id);

create policy "Only the owner can update letters"
on public.letters
for update
to authenticated
using (auth.uid() = recipient_id)
with check (auth.uid() = recipient_id);

create policy "Only the owner can delete letters"
on public.letters
for delete
to authenticated
using (auth.uid() = recipient_id);
```