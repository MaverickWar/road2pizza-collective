import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { networkMonitor } from '@/services/NetworkMonitoringService';
import { toast } from 'sonner';

const SUPABASE_URL = "https://zbcadnulavhsmzfvbwtn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiY2FkbnVsYXZoc216ZnZid3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjQzODAsImV4cCI6MjA1MDEwMDM4MH0.hcdXgSWpLnI-QFQOVDOeyrivuSDpFuhrqOOzL-OhxsY";

// Enhanced error handling for fetch operations
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    console.log('Making Supabase request to:', typeof input === 'string' ? input : input.toString());
    const response = await networkMonitor.monitorFetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Supabase request failed:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Supabase fetch error:', error);
    toast.error('Failed to connect to the database. Please try again later.');
    throw error;
  }
};

// Create Supabase client with enhanced fetch implementation
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    global: {
      fetch: customFetch,
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Add a health check function
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    console.log('Supabase connection check successful');
    return true;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};