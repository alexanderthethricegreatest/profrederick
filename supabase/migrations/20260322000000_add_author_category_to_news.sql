-- Create news table if it doesn't exist, then add author/category columns
CREATE TABLE IF NOT EXISTS news (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  timestamptz DEFAULT now() NOT NULL,
  title       text        NOT NULL,
  body        text        NOT NULL,
  author      text,
  category    text
);

-- Add columns idempotently in case table already exists without them
ALTER TABLE news ADD COLUMN IF NOT EXISTS author   text;
ALTER TABLE news ADD COLUMN IF NOT EXISTS category text;

-- Enable RLS (no-op if already enabled)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "public_read_news" ON news;
CREATE POLICY "public_read_news" ON news
  FOR SELECT TO public USING (true);
