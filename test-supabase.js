// Quick Supabase connection test
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');

// Hardcoded from .env.local for testing
const supabaseUrl = 'https://jqdhncxratnfyaymevtu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZGhuY3hyYXRuZnlheW1ldnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzAzOTcsImV4cCI6MjA3MTk0NjM5N30.KaJ7AdnviiXTDOw0bcAz6h3rAdMZMzsbd51JN1yYCN4';

console.log('🔧 Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('1️⃣  Testing basic connection...');

  try {
    // Test 1: Check if we can query tables
    console.log('\n2️⃣  Checking available tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('❌ Cannot query tables:', tablesError.message);
    } else {
      console.log('✅ Available tables:', tables?.map(t => t.table_name).join(', ') || 'none');
    }

    // Test 2: Check sources table specifically
    console.log('\n3️⃣  Testing sources table...');
    const { data: sources, error: sourcesError } = await supabase
      .from('sources')
      .select('count');

    if (sourcesError) {
      console.error('❌ Sources table error:', {
        message: sourcesError.message,
        details: sourcesError.details,
        hint: sourcesError.hint,
        code: sourcesError.code
      });
      console.log('\n💡 This means the sources table does NOT exist!');
      console.log('   You need to run the migration SQL in Supabase dashboard.');
    } else {
      console.log('✅ Sources table exists! Count:', sources);
    }

    // Test 3: Check notebooks table
    console.log('\n4️⃣  Testing notebooks table...');
    const { data: notebooks, error: notebooksError } = await supabase
      .from('notebooks')
      .select('*');

    if (notebooksError) {
      console.error('❌ Notebooks table error:', notebooksError.message);
    } else {
      console.log('✅ Notebooks table exists!');
      console.log('   Found', notebooks?.length || 0, 'notebooks');
      if (notebooks && notebooks.length > 0) {
        notebooks.forEach(nb => {
          console.log(`   - ${nb.name} (${nb.id})`);
        });
      }
    }

    // Test 4: Check replies table
    console.log('\n5️⃣  Testing replies table...');
    const { data: replies, error: repliesError } = await supabase
      .from('replies')
      .select('count');

    if (repliesError) {
      console.error('❌ Replies table error:', repliesError.message);
    } else {
      console.log('✅ Replies table exists! Count:', replies);
    }

  } catch (err) {
    console.error('\n❌ Unexpected error:', err);
  }
}

testConnection();
