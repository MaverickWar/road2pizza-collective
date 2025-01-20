import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { networkMonitor } from '@/services/NetworkMonitoringService';

const SUPABASE_URL = "https://zbcadnulavhsmzfvbwtn.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
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
    }
  }
);