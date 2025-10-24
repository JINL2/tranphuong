// Simple test to check if Supabase connection works
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jqdhncxratnfyaymevtu.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZGhuY3hyYXRuZnlheW1ldnR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM3MDM5NywiZXhwIjoyMDcxOTQ2Mzk3fQ.qK5RxzliR0MQMH7L7w123oU6fm5CWJXmjFhCchpT38U';

console.log('Creating Supabase client...');
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('Testing database insert...');
try {
  const { data, error } = await supabase
    .from('replies')
    .insert({
      name: 'Test User',
      position: 'Tester',
      contents: 'This is a test message',
      image_url: null,
      is_deleted: false
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Database error:', error);
  } else {
    console.log('✅ Success! Data inserted:', data);
  }
} catch (err) {
  console.error('❌ Unexpected error:', err);
}
