# Fix: "Error fetching sources: {}"

**Date**: October 27, 2025
**Issue**: Console error when loading chat pages
**Root Cause**: Missing `sources`, `notebooks`, and `replies` tables with proper RLS policies

---

## 🔍 Problem Identified

The error occurs because your Supabase database is missing:
1. ❌ `sources` table (for chat documents)
2. ❌ `notebooks` table (for chat sessions)
3. ❌ `replies` table (for memorial tributes)
4. ❌ **RLS Policies** (even if tables exist, they need public read access)

Your database currently has accounting/financial tables but not the memorial website tables.

---

## ✅ Solution: Run the SQL Migration

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: `jqdhncxratnfyaymevtu`
3. Click on "SQL Editor" in the left sidebar

### Step 2: Run the Migration

1. Click "New Query"
2. Copy the entire content of **[supabase_migration_fix.sql](supabase_migration_fix.sql)**
3. Paste it into the SQL Editor
4. Click "Run" or press `Ctrl+Enter`

### Step 3: Verify Success

After running the migration, you should see:
```
Success. No rows returned
```

Then run the verification queries at the bottom of the SQL file to confirm:
- ✅ 3 tables created (sources, notebooks, replies)
- ✅ RLS enabled on all tables
- ✅ 4 policies created
- ✅ 5 notebooks inserted

---

## 📋 What the Migration Does

### Creates Tables
```sql
✅ sources     - Stores book content for chat
✅ notebooks   - Chat session containers
✅ replies     - Memorial tribute messages
```

### Enables Row Level Security (RLS)
```sql
✅ All tables have RLS enabled
✅ Public can SELECT from all tables
✅ Public can INSERT tributes (replies)
```

### Adds Performance Indexes
```sql
✅ Fast lookup by notebook_id
✅ Fast sorting by created_at
✅ Efficient filtering by is_deleted
```

### Inserts Initial Data
```sql
✅ 5 notebooks (one for each book)
```

---

## 🧪 Test After Migration

### 1. Restart Dev Server
```bash
# Stop current server
lsof -ti:3000 | xargs kill -9

# Start fresh
npm run dev
```

### 2. Open Chat Page
```
http://localhost:3000/sach/1
```

### 3. Check Browser Console
Should now show:
```
✅ Fetching sources for notebook: 50d53e8e-b7fd-4bf4-8d3c-1fbca402068e
✅ useSources: Fetched sources DETAILED { count: 0, sources: [] }
```

### 4. No More Error!
The "Error fetching sources: {}" should be gone!

---

## 📊 Expected Behavior After Fix

### Chat Page (http://localhost:3000/sach/1)
- ✅ Loads without console errors
- ✅ Shows "Upload a source to get started..." (because no sources uploaded yet)
- ✅ Input field visible at bottom (our UI fix)
- ✅ Everything works!

### Memorial Page (http://localhost:3000/tuong-nho)
- ✅ Can display tributes (if any exist in `replies` table)
- ✅ Users can submit new tributes

---

## 🗄️ Adding Book Content (Optional)

If you want to populate the books with actual content for chat:

### Option 1: Manual Insert via SQL
```sql
INSERT INTO public.sources (
  notebook_id,
  title,
  type,
  content,
  processing_status
) VALUES (
  '50d53e8e-b7fd-4bf4-8d3c-1fbca402068e', -- Book 1 notebook
  'Hồi Ký Trần Phương',
  'pdf',
  'Your book content here...',
  'completed'
);
```

### Option 2: Build Upload Feature
Create an admin page to upload PDFs and process them into the `sources` table.

---

## 🔧 Troubleshooting

### If Error Persists After Migration:

1. **Clear Browser Cache**
   ```
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

2. **Check Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Look for any errors

3. **Verify Tables Created**
   Run in SQL Editor:
   ```sql
   SELECT * FROM public.sources LIMIT 1;
   SELECT * FROM public.notebooks LIMIT 1;
   SELECT * FROM public.replies LIMIT 1;
   ```

4. **Check RLS Policies**
   ```sql
   SELECT tablename, policyname
   FROM pg_policies
   WHERE tablename IN ('sources', 'notebooks', 'replies');
   ```

---

## 📝 Summary

| Issue | Status | Solution |
|-------|--------|----------|
| Chat UI Layout | ✅ FIXED | CSS Grid implementation |
| Missing tables | ⚠️ PENDING | Run supabase_migration_fix.sql |
| RLS Policies | ⚠️ PENDING | Included in migration |
| Error message | ⚠️ PENDING | Will disappear after migration |

---

## ✅ Next Steps

1. **Run the migration**: [supabase_migration_fix.sql](supabase_migration_fix.sql)
2. **Restart dev server**: `npm run dev`
3. **Test chat page**: http://localhost:3000/sach/1
4. **Verify no errors**: Check browser console

After migration, everything should work perfectly! The chat UI is already fixed, we just need the database tables.

---

**Files to Use**:
- **Migration SQL**: [supabase_migration_fix.sql](supabase_migration_fix.sql)
- **This Guide**: [FIX_SOURCES_ERROR.md](FIX_SOURCES_ERROR.md)

**Ready to fix!** 🚀
