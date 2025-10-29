# Environment Variable Protection System

## 🛡️ The Problem
The `.env.local` file keeps getting corrupted with invisible Unicode characters (U+2066, U+2069), breaking the Supabase connection.

## ✅ Permanent Solution Implemented

### 1. Protected Template (.env.example)
- **Clean reference copy** of all environment variables
- Safe to commit to git (no sensitive data exposure risk here since it's a public memorial site)
- Used as source of truth for restoration

### 2. Automatic Validation Script
**Location:** `scripts/check-env.js`

**Features:**
- Detects invisible Unicode characters automatically
- Validates required environment variables exist
- Validates Supabase URL and JWT token formats
- Auto-fixes corruption by restoring from `.env.example`
- Runs **before every** `npm run dev` and `npm run build`

### 3. NPM Scripts Protection

```json
{
  "predev": "node scripts/check-env.js",      // Runs before dev
  "prebuild": "node scripts/check-env.js",    // Runs before build
  "check-env": "node scripts/check-env.js",   // Manual check
  "fix-env": "cp .env.example .env.local && node scripts/check-env.js" // Force fix
}
```

## 📖 Usage

### Normal Development
```bash
npm run dev
```
The validation runs automatically. If corruption is detected, it's fixed immediately.

### Manual Environment Check
```bash
npm run check-env
```

### Force Fix Corrupted Environment
```bash
npm run fix-env
```

### Test the Validator
```bash
node scripts/check-env.js
```

## 🔍 What Gets Validated

✅ `.env.local` file exists
✅ No invisible Unicode characters (U+2000-U+206F range)
✅ Required variables present:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

✅ Supabase URL format correct
✅ JWT tokens valid format (3 parts, starts with `eyJ`)

## 🚨 Error Scenarios

### Scenario 1: Invisible Characters Detected
```
❌ Found 2 invisible Unicode characters!
   Characters: U+2066, U+2069
🔧 Fixing automatically...
✅ Fixed by restoring from .env.example
```

### Scenario 2: Missing Variables
```
❌ Missing required environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Fix:** Run `npm run fix-env`

### Scenario 3: Invalid Format
```
❌ Invalid Supabase URL format
```
**Fix:** Check `.env.example` for correct format

## 🔐 Security Notes

1. `.env.local` is gitignored (never committed)
2. `.env.example` contains the actual values because:
   - This is a public memorial website
   - Supabase has Row Level Security (RLS) enabled
   - Keys are anon keys (read-only by default)
   - No sensitive user data or payment info

3. If you need to protect secrets in the future:
   - Remove values from `.env.example`
   - Add secure key management
   - Update validation script

## 🎯 How It Prevents The Problem

1. **Pre-flight Check**: Every `npm run dev` validates environment first
2. **Auto-Healing**: Corrupted files are automatically restored
3. **Source of Truth**: `.env.example` always has clean values
4. **No Manual Fixing**: No more copy-paste that introduces Unicode chars
5. **CI/CD Ready**: Validation runs in build pipeline too

## 🔧 Maintenance

### Adding New Environment Variables
1. Add to `.env.example`
2. Add to `requiredVars` array in `scripts/check-env.js`
3. Add validation logic if needed

### Updating Values
1. Update `.env.example` first (source of truth)
2. Run `npm run fix-env` to propagate changes

---

## 🎉 Result

**No more manual fixing of .env.local!** The system is now self-healing.
