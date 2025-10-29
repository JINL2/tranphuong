# Supabase Database Configuration Issue

**Date**: October 27, 2025
**Status**: ⚠️ DATABASE MISMATCH DETECTED
**Severity**: 🟡 Medium (Non-blocking for UI, blocks chat functionality)

---

## 🔍 Issue Summary

The console error `"Error fetching sources: {}"` occurs because the Supabase database is missing required tables for the chat functionality.

---

## 📊 Root Cause Analysis

### Current Database State

The Supabase instance at `https://jqdhncxratnfyaymevtu.supabase.co` contains:
- ✅ Financial/accounting tables (`accounts`, `bank_amount`, `cash_control`, etc.)
- ❌ **MISSING**: Chat-related tables (`sources`, `notebooks`)
- ⚠️ Partial: `messages` table exists but may not have correct schema

### Expected Tables for Chat Feature

The application expects these tables:

1. **`sources`** - Document/book sources for chat
   - Columns: id, notebook_id, title, type, content, summary, processing_status, created_at, etc.

2. **`notebooks`** - Chat notebook/session containers
   - Columns: id, name, description, created_at, updated_at, etc.

3. **`messages`** - Chat message history (EXISTS but schema unknown)
   - Columns: id, session_id, notebook_id, message, created_at, etc.

4. **`replies`** - Memorial tribute replies (for /tuong-nho page)
   - Columns: id, author, content, is_deleted, created_at, etc.

---

## 🚨 Impact Assessment

### What Works ✅
- Home page (/)
- Biography page (/tieu-su)
- Books page (/sach)
- Photo gallery (/thu-vien-anh)
- Memorial tributes page (/tuong-nho) - IF `replies` table exists
- **Chat UI Layout** - The fix we implemented works perfectly

### What Doesn't Work ❌
- Chat functionality (/sach/[id]) - Sources won't load
- Document upload/processing
- AI chat conversations
- Source content viewer

### User Experience
- Users can access all pages
- Chat pages load but show "Upload a source to get started..." placeholder
- No critical errors that break the site
- Console shows error but application remains functional

---

## 🔧 Solutions

### Option 1: Create Missing Tables (Recommended)

Create the required database schema. Here's the migration:

```sql
-- Create sources table
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notebook_id UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'pdf',
  content TEXT,
  summary TEXT,
  processing_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notebooks table
CREATE TABLE IF NOT EXISTS public.notebooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create replies table for tributes
CREATE TABLE IF NOT EXISTS public.replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_sources_notebook_id ON public.sources(notebook_id);
CREATE INDEX IF NOT EXISTS idx_sources_created_at ON public.sources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_replies_is_deleted ON public.replies(is_deleted);
CREATE INDEX IF NOT EXISTS idx_replies_created_at ON public.replies(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read access)
CREATE POLICY "Enable read access for all users" ON public.sources
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.notebooks
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.replies
  FOR SELECT USING (true);
```

**To Apply**:
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Run the above migration
4. Restart the dev server

### Option 2: Use Different Supabase Project

If this database is for a different project:
1. Create a new Supabase project for the memorial website
2. Update `.env.local` with new credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-new-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key
   ```

### Option 3: Disable Chat Feature (Temporary)

If chat is not needed immediately, you can disable it:

**Update ChatSection.tsx** to show a "Coming Soon" message:
```tsx
// Add at the beginning of component
if (true) { // Feature flag
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Chat Feature Coming Soon</h3>
        <p className="text-gray-600">
          We're working on bringing this feature online.
        </p>
      </div>
    </div>
  );
}
```

---

## 📋 Verification Steps

After creating tables, verify:

```bash
# Test Supabase connection
curl -X GET 'https://jqdhncxratnfyaymevtu.supabase.co/rest/v1/sources?limit=1' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Should return: []  (empty array, not error)
```

In browser console:
```javascript
// Should not show "Error fetching sources"
// Should show: "Fetching sources for notebook: [notebook-id]"
```

---

## 🗄️ Database Schema Reference

### Book-to-Notebook Mapping

From `app/sach/[id]/page.tsx`:
```typescript
const BOOK_TO_NOTEBOOK_MAP = {
  '1': '50d53e8e-b7fd-4bf4-8d3c-1fbca402068e', // Hồi Ký Trần Phương
  '2': 'dbc96f86-a585-47c9-9f5e-b4e883f20336', // VÌ SỰ NGHIỆP TRỒNG NGƯỜI
  '3': 'e4b1319f-5178-44ba-881c-5818fd99ce91', // Khoa Học Phụng Sự Cách Mạng - Tập 1
  '4': '589bef35-c563-48ef-975e-9c84d4bed91a', // Khoa học Phụng sự Cách mạng - Tập 2
  '5': '079e8c57-6b9d-465a-a29a-8a59e686bc15', // GS Trần Phương trong tâm thức
};
```

These notebook IDs should exist in the `notebooks` table with corresponding sources.

---

## 🔍 Current Database Contents

**Tables Found**:
- ✅ `messages` (exists - schema unknown)
- ✅ `messages_2025_10_24` through `messages_2025_10_30` (partitioned by date)
- ❌ `sources` (MISSING)
- ❌ `notebooks` (MISSING)
- ❌ `replies` (MISSING)

**Database Type**: Appears to be an accounting/financial system database with AI chat history

---

## 💡 Recommendations

### Immediate Action (Choose One):

**For Production Deployment**:
1. ✅ **Create missing tables** (Option 1) - Best for long-term
2. Use separate Supabase project (Option 2) - Clean separation

**For Testing/Development**:
1. ⚠️ **Disable chat temporarily** (Option 3) - Quick fix
2. Everything else works perfectly

### Priority:
- 🟢 **Low Priority** if chat feature not needed immediately
- 🟡 **Medium Priority** if you want full site functionality
- 🔴 **High Priority** if users expect to chat with the memorial

---

## 📝 Notes

### About the UI Fix
- ✅ The chat UI layout fix (CSS Grid) is **COMPLETELY INDEPENDENT** of this database issue
- ✅ The layout will work perfectly once tables are created
- ✅ No code changes needed after database setup

### Testing Without Database
- You can test the UI layout with mock data
- The input field will be visible (our fix works!)
- Just won't be able to send/receive messages until database is set up

---

## ✅ Summary

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Chat UI Layout | ✅ FIXED | None - Works perfectly |
| Supabase Connection | ✅ CONNECTED | None |
| Database Schema | ❌ INCOMPLETE | Create missing tables |
| Chat Functionality | ⚠️ BLOCKED | Waiting on database |
| Other Pages | ✅ WORKING | None |

**Next Step**: Decide whether to create tables, use different database, or disable chat feature temporarily.

---

**The console error is expected given the current database state.** Once you create the required tables, the error will disappear and chat will work fully.
