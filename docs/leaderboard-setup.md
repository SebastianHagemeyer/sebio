# Pee Panic leaderboard — Supabase setup

The leaderboard is backed by [Supabase](https://supabase.com). Until you add
your project credentials the leaderboard degrades gracefully (it shows
"Leaderboard not configured yet" and score submissions no-op).

## 1. Create the project and table

Create a Supabase project, then run this in the **SQL Editor**:

```sql
create table public.scores (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 20),
  score integer not null check (score >= 0 and score <= 100000),
  created_at timestamptz default now()
);

-- Row Level Security: the anon key is public, so RLS is what protects the table.
alter table public.scores enable row level security;

create policy "anyone can read scores"
  on public.scores for select
  using (true);

create policy "anyone can insert a valid score"
  on public.scores for insert
  with check (char_length(name) between 1 and 20 and score >= 0 and score <= 100000);
```

## 2. Add your credentials

In **Project Settings → API**, copy the **Project URL** and the **anon public**
key, then paste them into `src/scripts/leaderboard.js`:

```js
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-SUPABASE-ANON-KEY";
```

The anon key is designed to be exposed in client code — access is governed by
the RLS policies above. (Never put the `service_role` key in the site.)

## 3. Notes

- **Spoofing:** because the insert policy runs client-side, anyone can submit a
  score (same exposure as any public client-write leaderboard). The bounds in
  the policy cap obvious abuse. For stronger guarantees, move inserts behind an
  Edge Function with a shared secret or a simple proof-of-play check.
- **Free tier:** ~2 active projects per org; free projects pause after ~1 week
  of inactivity (restore from the dashboard). Check current limits on the
  Supabase pricing page.
