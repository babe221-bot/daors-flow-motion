const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
require('dotenv').config();

console.log('🔍 Testing Supabase Database Connection...\n');

// Test 1: Supabase Client Connection
async function testSupabaseClient() {
  console.log('📡 Test 1: Supabase Client Connection');
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase URL or API key in environment variables');
    }
    
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test a simple query
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(5);
    
    if (error) {
      throw error;
    }
    
    console.log('   ✅ Supabase client connection successful!');
    console.log(`   📊 Found ${data?.length || 0} tables`);
    return true;
  } catch (error) {
    console.log('   ❌ Supabase client connection failed:');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 2: Direct PostgreSQL Connection
async function testDirectPostgreSQL() {
  console.log('\n🐘 Test 2: Direct PostgreSQL Connection');
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('Missing DATABASE_URL in environment variables');
    }
    
    console.log(`   Connection: ${connectionString.replace(/:[^:@]*@/, ':****@')}`);
    
    const client = new Client({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    await client.connect();
    console.log('   ✅ PostgreSQL connection established!');
    
    // Test query
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log(`   📊 Database: ${result.rows[0].current_database}`);
    console.log(`   👤 User: ${result.rows[0].current_user}`);
    console.log(`   🔧 Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    
    // Test table access
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name 
      LIMIT 10
    `);
    
    console.log(`   📋 Public tables found: ${tablesResult.rows.length}`);
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`      - ${row.table_name}`);
      });
    }
    
    await client.end();
    return true;
  } catch (error) {
    console.log('   ❌ PostgreSQL connection failed:');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 3: Environment Variables Check
function testEnvironmentVariables() {
  console.log('\n🔧 Test 3: Environment Variables Check');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DATABASE_URL',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      if (varName.includes('PASSWORD') || varName.includes('KEY')) {
        console.log(`   ✅ ${varName}: ${'*'.repeat(Math.min(value.length, 20))}`);
      } else {
        console.log(`   ✅ ${varName}: ${value}`);
      }
    } else {
      console.log(`   ❌ ${varName}: Not set`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Supabase Connection Tests\n');
  console.log('=' .repeat(50));
  
  const envCheck = testEnvironmentVariables();
  const supabaseTest = await testSupabaseClient();
  const pgTest = await testDirectPostgreSQL();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log(`   Environment Variables: ${envCheck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Supabase Client: ${supabaseTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   PostgreSQL Direct: ${pgTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (envCheck && (supabaseTest || pgTest)) {
    console.log('\n🎉 Database connection is working!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Run the tests
runAllTests().catch(console.error);