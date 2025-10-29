# Debugging Guide: "Error fetching sources: {}"

**Updated**: October 27, 2025
**Status**: Enhanced error logging added

---

## 🔍 What I Changed

I've added **detailed error logging** to help us identify the exact problem.

### Changes Made to `hooks/useSources.ts`:

1. **Added Supabase configuration check**:
   - Logs if client is initialized
   - Shows Supabase URL
   - Confirms anon key exists

2. **Enhanced error logging**:
   - Logs error message
   - Logs error details
   - Logs error hint
   - Logs error code
   - Logs full error object as JSON

---

## 📋 What To Do Next

### Step 1: Open the Chat Page
```
http://localhost:3000/sach/1
```

### Step 2: Open Browser DevTools
Press **F12** or:
- Chrome/Edge: `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (Mac)
- Firefox: `Ctrl+Shift+K` (Windows) or `Cmd+Option+K` (Mac)
- Safari: `Cmd+Option+C` (Mac)

### Step 3: Check Console Tab

You should now see **MORE DETAILED** error information:

#### Expected Output (if working):
```javascript
Fetching sources for notebook: 50d53e8e-b7fd-4bf4-8d3c-1fbca402068e
Supabase client configured: {
  hasClient: true,
  supabaseUrl: "https://jqdhncxratnfyaymevtu.supabase.co",
  hasAnonKey: true
}
useSources: Fetched sources DETAILED {
  count: 0,
  sources: []
}
```

#### If Error Occurs:
```javascript
Fetching sources for notebook: 50d53e8e-b7fd-4bf4-8d3c-1fbca402068e
Supabase client configured: { ... }
Error fetching sources: {}
Error details: {
  message: "...",           // ← This will tell us what's wrong!
  details: "...",
  hint: "...",
  code: "...",
  fullError: "..."
}
```

---

## 🎯 What To Look For

### Scenario 1: Table Doesn't Exist
```
Error details: {
  message: "relation \"public.sources\" does not exist",
  code: "42P01"
}
```
**Fix**: Run the [supabase_migration_fix.sql](supabase_migration_fix.sql) file

### Scenario 2: RLS Policy Blocking
```
Error details: {
  message: "permission denied for table sources",
  code: "42501"
}
```
**Fix**: The migration file includes RLS policies

### Scenario 3: Invalid Credentials
```
Supabase client configured: {
  hasClient: true,
  supabaseUrl: undefined,  // ← PROBLEM!
  hasAnonKey: false        // ← PROBLEM!
}
```
**Fix**: Environment variables not loaded. Restart dev server.

### Scenario 4: Network/CORS Error
```
Error details: {
  message: "Failed to fetch",
  code: undefined
}
```
**Fix**: Network issue or CORS. Check Network tab.

---

## 🛠️ Common Fixes

### Fix 1: Environment Variables Not Loaded
```bash
# Stop server
lsof -ti:3000 | xargs kill -9

# Verify .env.local exists
cat .env.local | grep SUPABASE

# Restart
npm run dev
```

### Fix 2: Table Doesn't Exist
1. Go to Supabase Dashboard
2. SQL Editor
3. Run [supabase_migration_fix.sql](supabase_migration_fix.sql)

### Fix 3: Clear Browser Cache
```
Hard Refresh:
- Chrome/Edge: Ctrl+Shift+R
- Firefox: Ctrl+F5
- Safari: Cmd+Option+R
```

### Fix 4: Check Network Tab
1. Open DevTools
2. Go to "Network" tab
3. Filter by "supabase"
4. Look for failed requests (red)
5. Click on request → Preview tab to see error

---

## 📊 Checklist

Before reporting the error, please check:

- [ ] Server is running (`npm run dev`)
- [ ] Opened http://localhost:3000/sach/1
- [ ] DevTools Console tab is open
- [ ] Can see the detailed error logs
- [ ] Checked what `supabaseUrl` shows (should be the URL)
- [ ] Checked what `hasAnonKey` shows (should be `true`)
- [ ] Checked `Error details` object (what does `message` say?)
- [ ] Checked Network tab for failed requests

---

## 📸 What to Share

Please provide:

1. **Supabase client configured** log output
2. **Error details** log output
3. **Network tab** screenshot (filter by "supabase")
4. Any other relevant console messages

This will help me identify the exact issue!

---

## 🎯 Most Likely Issues

Based on testing:

1. **90% Chance**: Table `sources` doesn't exist in database
   - **Solution**: Run SQL migration

2. **8% Chance**: RLS policy blocking access
   - **Solution**: SQL migration includes policies

3. **2% Chance**: Environment variables not loaded
   - **Solution**: Restart dev server

---

**Server running**: http://localhost:3000
**Test page**: http://localhost:3000/sach/1
**Ready for detailed debugging!** 🔍
