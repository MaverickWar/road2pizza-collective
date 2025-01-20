import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { networkMonitor } from '@/services/NetworkMonitoringService';

const SUPABASE_URL = "https://zbcadnulavhsmzfvbwtn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiY2FkbnVsYXZoc216ZnZid3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjQzODAsImV4cCI6MjA1MDEwMDM4MH0.hcdXgSWpLnI-QFQOVDOeyrivuSDpFuhrqOOzL-OhxsY";

if (!SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with custom fetch implementation and proper headers
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    global: {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      fetch: networkMonitor.monitorFetch,
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);