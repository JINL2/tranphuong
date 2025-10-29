# Supabase Database Setup Guide

## 🎯 Problem Identified
The database tables (`sources`, `notebooks`, `replies`) don't exist yet in your Supabase project. This is why you're getting the "Error fetching sources" console error.

## ✅ Solution: Apply the Migration

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/jqdhncxratnfyaymevtu
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy and Execute the Migration Script

Copy the **entire contents** of the file `supabase_migration_fix.sql` (already in your project root) and paste it into the SQL Editor.

Or copy this script:

```sql
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
```

### Step 3: Run the Script
1. Click the **Run** button (or press `Cmd/Ctrl + Enter`)
2. Wait for the success message: "Success. No rows returned"

### Step 4: Verify the Setup

Run these verification queries one by one in the SQL Editor:

**Check if tables exist:**
```sql
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('sources', 'notebooks', 'replies');
```
Expected result: 3 rows showing the three tables

**Check if RLS is enabled:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('sources', 'notebooks', 'replies');
```
Expected result: All three tables with `rowsecurity = true`

**Check notebooks data:**
```sql
SELECT id, name FROM public.notebooks ORDER BY name;
```
Expected result: 5 rows with book notebooks

## 🔗 Next Steps After Migration

### Step 5: Map Notebooks to Books

You need to update your book pages to use the correct notebook IDs. Here's the mapping:

| Book ID | Book Title | Notebook ID |
|---------|-----------|-------------|
| 1 | Một thời hào hùng (Hồi ký) | `50d53e8e-b7fd-4bf4-8d3c-1fbca402068e` |
| 2 | Vì sự nghiệp trồng người | `dbc96f86-a585-47c9-9f5e-b4e883f20336` |
| 3 | Khoa học phụng sự cách mạng - Tập 1 | `e4b1319f-5178-44ba-881c-5818fd99ce91` |
| 4 | Khoa học phụng sự cách mạng - Tập 2 | `589bef35-c563-48ef-975e-9c84d4bed91a` |
| 5 | GS Trần Phương trong tâm thức đồng nghiệp | `079e8c57-6b9d-465a-a29a-8a59e686bc15` |

### Step 6: Add Content to Sources Table

For each book, you'll need to add source documents (PDFs, text content) to the `sources` table. Example:

```sql
INSERT INTO public.sources (notebook_id, title, type, content, summary) VALUES
  (
    '50d53e8e-b7fd-4bf4-8d3c-1fbca402068e',
    'Chapter 1: Tuổi thơ',
    'text',
    'Full content of chapter 1...',
    'Summary of chapter 1...'
  );
```

## 📊 What This Migration Does

1. **Creates 3 tables:**
   - `sources`: Stores book content, chapters, documents
   - `notebooks`: Represents each book (5 notebooks created)
   - `replies`: Stores memorial tributes from visitors

2. **Sets up security:**
   - Enables Row Level Security (RLS) on all tables
   - Allows public read access to sources and notebooks
   - Allows public to submit tributes (insert to replies)

3. **Optimizes performance:**
   - Creates indexes on frequently queried columns
   - Enables fast lookups by notebook_id and created_at

4. **Initializes data:**
   - Creates 5 notebook entries matching your 5 books

## 🐛 Troubleshooting

If you still see errors after applying the migration:

1. **Clear browser cache:** Hard refresh with `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Restart dev server:** Stop and restart `npm run dev`
3. **Check Supabase logs:** Go to Logs → Database in Supabase dashboard
4. **Verify environment variables:** Make sure `.env.local` has correct Supabase URL and anon key

## ✅ Success Indicators

After completing the migration, you should see:
- ✅ No console errors about "Error fetching sources"
- ✅ Chat interface shows "Saved sources will appear here"
- ✅ Sources displayed once you add content to the database
- ✅ Clean console logs showing successful Supabase queries

---

**Need help?** Let me know after you've run the migration and I'll help with the next steps!
