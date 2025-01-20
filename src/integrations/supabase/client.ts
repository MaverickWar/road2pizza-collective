import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { networkMonitor } from '@/services/NetworkMonitoringService';

const SUPABASE_URL = "https://zbcadnulavhsmzfvbwtn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiY2FkbnVsYXZoc216ZnZid3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjQzODAsImV4cCI6MjA1MDEwMDM4MH0.hcdXgSWpLnI-QFQOVDOeyrivuSDpFuhrqOOzL-OhxsY";

// Create Supabase client with custom fetch implementation
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    global: {
      fetch: networkMonitor.monitorFetch,
    },
  }
);