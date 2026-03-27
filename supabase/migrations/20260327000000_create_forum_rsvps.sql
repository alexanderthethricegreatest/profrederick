-- Migration: create forum_rsvps table
-- Community Forum RSVP — April 15, 2026 at Trumpet Vine Farm

create table if not exists forum_rsvps (
  id            uuid        default gen_random_uuid() primary key,
  created_at    timestamptz default now(),

  -- Attendee info
  full_name     text        not null,
  email         text        not null unique,

  -- Optional details
  district      text,
  guest_count   integer     not null default 1
    check (guest_count between 1 and 10),
  questions     text
);

-- Enable Row Level Security
alter table forum_rsvps enable row level security;

-- Service role only — no public read or write
create policy "service_role_only" on forum_rsvps
  for all
  using (auth.role() = 'service_role');
