-- Migration: create survey_responses table
-- Frederick County Resident Feedback on Data Center Development Survey

create table if not exists survey_responses (
  id                uuid        default gen_random_uuid() primary key,
  created_at        timestamptz default now(),

  -- Contact
  full_name         text        not null,
  email             text        not null unique,

  -- Section 1: Residency & Demographics
  district          text        not null,
  residence_length  text        not null,

  -- Section 2: Awareness & Overall Sentiment
  news_following    text        not null,
  overall_stance    text        not null,

  -- Section 3: Exploring the Impacts
  benefits          text[]      not null default '{}',
  benefits_other    text,
  concerns          text[]      not null default '{}',
  concerns_other    text,

  -- Section 4: Zoning & Future Planning
  zoning_preference    text     not null,
  ag_importance        integer  not null default 5
    check (ag_importance between 1 and 10),
  tax_increase_favor   text,
  additional_comments  text
);

-- Enable Row Level Security
alter table survey_responses enable row level security;

-- Service role only — no public read or write
create policy "service_role_only" on survey_responses
  for all
  using (auth.role() = 'service_role');
