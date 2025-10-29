#!/usr/bin/env node

/**
 * Environment Variable Validator
 * Prevents invisible Unicode characters and validates Supabase configuration
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '..', '.env.local');
const ENV_EXAMPLE = path.join(__dirname, '..', '.env.example');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkInvisibleCharacters(content) {
  // Check for invisible Unicode characters
  const invisibleChars = /[\u200B-\u200D\u2060-\u2069\uFEFF]/g;
  const matches = content.match(invisibleChars);

  if (matches) {
    return {
      found: true,
      count: matches.length,
      chars: [...new Set(matches)].map(c => `U+${c.charCodeAt(0).toString(16).toUpperCase()}`)
    };
  }

  return { found: false };
}

function validateEnvFile() {
  log('blue', '\n🔍 Checking environment variables...\n');

  // Check if .env.local exists
  if (!fs.existsSync(ENV_FILE)) {
    log('red', '❌ .env.local file not found!');

    if (fs.existsSync(ENV_EXAMPLE)) {
      log('yellow', '📝 Copying from .env.example...');
      fs.copyFileSync(ENV_EXAMPLE, ENV_FILE);
      log('green', '✅ Created .env.local from .env.example');
    } else {
      log('red', '❌ .env.example not found either. Please create .env.local manually.');
      process.exit(1);
    }
  }

  // Read the file
  const content = fs.readFileSync(ENV_FILE, 'utf8');

  // Check for invisible characters
  const invisibleCheck = checkInvisibleCharacters(content);
  if (invisibleCheck.found) {
    log('red', `❌ Found ${invisibleCheck.count} invisible Unicode characters!`);
    log('yellow', `   Characters: ${invisibleCheck.chars.join(', ')}`);
    log('yellow', '🔧 Fixing automatically...');

    // Copy from .env.example to fix
    if (fs.existsSync(ENV_EXAMPLE)) {
      fs.copyFileSync(ENV_EXAMPLE, ENV_FILE);
      log('green', '✅ Fixed by restoring from .env.example');
    } else {
      log('red', '❌ Cannot fix: .env.example not found');
      process.exit(1);
    }
  }

  // Validate required variables
  const lines = fs.readFileSync(ENV_FILE, 'utf8').split('\n');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missingVars = [];
  const foundVars = {};

  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        foundVars[key.trim()] = value.trim();
      }
    }
  }

  for (const varName of requiredVars) {
    if (!foundVars[varName] || foundVars[varName].length === 0) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    log('red', '❌ Missing required environment variables:');
    missingVars.forEach(v => log('red', `   - ${v}`));
    process.exit(1);
  }

  // Validate Supabase URL format
  const supabaseUrl = foundVars['NEXT_PUBLIC_SUPABASE_URL'];
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    log('red', '❌ Invalid Supabase URL format');
    process.exit(1);
  }

  // Validate JWT tokens (basic check)
  const anonKey = foundVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const serviceKey = foundVars['SUPABASE_SERVICE_ROLE_KEY'];

  if (!anonKey.startsWith('eyJ') || anonKey.split('.').length !== 3) {
    log('red', '❌ Invalid anon key format (not a valid JWT)');
    process.exit(1);
  }

  if (!serviceKey.startsWith('eyJ') || serviceKey.split('.').length !== 3) {
    log('red', '❌ Invalid service role key format (not a valid JWT)');
    process.exit(1);
  }

  // All checks passed
  log('green', '✅ All environment variables are valid!');
  log('blue', `   Supabase URL: ${supabaseUrl}`);
  log('blue', `   Anon Key: ${anonKey.substring(0, 20)}...`);
  log('blue', `   Service Key: ${serviceKey.substring(0, 20)}...`);
  log('green', '\n✨ Environment is ready!\n');
}

// Run validation
try {
  validateEnvFile();
} catch (error) {
  log('red', `\n❌ Error: ${error.message}\n`);
  process.exit(1);
}
