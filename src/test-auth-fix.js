// Simple test to verify auth fixes
import { pingSupabase, checkSupabaseHealth } from './lib/supabase-health.js';

async function testAuthFixes() {
  console.log('🔍 Testing authentication fixes...');
  
  try {
    // Test 1: Ping Supabase
    console.log('📡 Testing Supabase connectivity...');
    const isReachable = await pingSupabase();
    console.log(`✅ Supabase reachable: ${isReachable}`);
    
    // Test 2: Health check
    console.log('🏥 Running health check...');
    const health = await checkSupabaseHealth();
    console.log('✅ Health check result:', health);
    
    // Test 3: Test timeout handling
    console.log('⏱️ Testing timeout handling...');
    const startTime = Date.now();
    
    try {
      // This should either succeed or fail gracefully within our timeout
      const response = await fetch('https://aysikssfvptxeclfymlk.supabase.co/rest/v1/', {
        method: 'HEAD',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5c2lrc3NmdnB0eGVjbGZ5bWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODUwODcsImV4cCI6MjA3MDA2MTA4N30.MlhXvs_XZgSJxltCwMxn50FP0hZgOZDR8Jtl4SEDkOI'
        },
        signal: AbortSignal.timeout(10000)
      });
      
      const duration = Date.now() - startTime;
      console.log(`✅ Request completed in ${duration}ms with status: ${response.status}`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`⚠️ Request failed after ${duration}ms:`, error.message);
    }
    
    console.log('🎉 Auth fix tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAuthFixes();