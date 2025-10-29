-- Memorial Website - Database Setup Migration
-- Run this in your Supabase SQL Editor
-- Date: October 27, 2025

-- ============================================
-- CREATE TABLES
-- ============================================

-- Create sources table for chat documents
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notebook_id UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'pdf',
  url TEXT,
  file_path TEXT,
  file_size BIGINT,
  display_name TEXT,
  content TEXT,
  summary TEXT,
  processing_status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notebooks table
CREATE TABLE IF NOT EXISTS public.notebooks (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create replies table for memorial tributes
CREATE TABLE IF NOT EXISTS public.replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author TEXT,
  name TEXT,
  contents TEXT,
  content TEXT,
  position TEXT,
  image_url TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_sources_notebook_id
ON public.sources(notebook_id);

CREATE INDEX IF NOT EXISTS idx_sources_created_at
ON public.sources(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sources_processing_status
ON public.sources(processing_status);

CREATE INDEX IF NOT EXISTS idx_replies_is_deleted
ON public.replies(is_deleted)
WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_replies_created_at
ON public.replies(created_at DESC);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- Sources: Allow public read access (no authentication required)
DROP POLICY IF EXISTS "Allow public read access to sources" ON public.sources;
CREATE POLICY "Allow public read access to sources"
ON public.sources FOR SELECT
USING (true);

-- Notebooks: Allow public read access
DROP POLICY IF EXISTS "Allow public read access to notebooks" ON public.notebooks;
CREATE POLICY "Allow public read access to notebooks"
ON public.notebooks FOR SELECT
USING (true);

-- Replies: Allow public read access (only non-deleted)
DROP POLICY IF EXISTS "Allow public read access to replies" ON public.replies;
CREATE POLICY "Allow public read access to replies"
ON public.replies FOR SELECT
USING (is_deleted = FALSE);

-- Replies: Allow public insert (for tribute submissions)
DROP POLICY IF EXISTS "Allow public insert to replies" ON public.replies;
CREATE POLICY "Allow public insert to replies"
ON public.replies FOR INSERT
WITH CHECK (true);

-- ============================================
-- INSERT INITIAL DATA
-- ============================================

-- Insert notebooks for each book
INSERT INTO public.notebooks (id, name, description) VALUES
  ('50d53e8e-b7fd-4bf4-8d3c-1fbca402068e', 'Hồi Ký Trần Phương: Một Thời Hào Hùng', 'Book 1'),
  ('dbc96f86-a585-47c9-9f5e-b4e883f20336', 'VÌ SỰ NGHIỆP TRỒNG NGƯỜI', 'Book 2'),
  ('e4b1319f-5178-44ba-881c-5818fd99ce91', 'Khoa Học Phụng Sự Cách Mạng - Tập 1', 'Book 3'),
  ('589bef35-c563-48ef-975e-9c84d4bed91a', 'Khoa học Phụng sự Cách mạng - Tập 2', 'Book 4'),
  ('079e8c57-6b9d-465a-a29a-8a59e686bc15', 'GS Trần Phương trong tâm thức đồng nghiệp và bạn bè', 'Book 5')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify the setup:

-- 1. Check if tables exist
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('sources', 'notebooks', 'replies');

-- 2. Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('sources', 'notebooks', 'replies');

-- 3. Check policies
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('sources', 'notebooks', 'replies');

-- 4. Check notebooks data
SELECT id, name FROM public.notebooks ORDER BY name;

-- Done! Your database is now ready for the memorial website.
