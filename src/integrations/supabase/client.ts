import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { networkMonitor } from '@/services/NetworkMonitoringService';

const SUPABASE_URL = "https://zbcadnulavhsmzfvbwtn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiY2FkbnVsYXZoc216ZnZid3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU3NTg0MDAsImV4cCI6MjAyMTMzNDQwMH0.SHK7c4xgGaKpvxS9A8Zg7p_Jw_1kBgGvVxNY8JNShfo";

if (!SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with custom fetch implementation
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    global: {
      fetch: networkMonitor.monitorFetch,
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);