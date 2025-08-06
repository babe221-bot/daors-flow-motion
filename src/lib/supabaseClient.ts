import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aysikssfvptxeclfymlk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5c2lrc3NmdnB0eGVjbGZ5bWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODUwODcsImV4cCI6MjA3MDA2MTA4N30.MlhXvs_XZgSJxltCwMxn50FP0hZgOZDR8Jtl4SEDkOI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
