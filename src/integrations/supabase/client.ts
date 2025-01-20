import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from 'sonner';

const SUPABASE_URL = "https://zbcadnulavhsmzfvbwtn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiY2FkbnVsYXZoc216ZnZid3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjQzODAsImV4cCI6MjA1MDEwMDM4MH0.hcdXgSWpLnI-QFQOVDOeyrivuSDpFuhrqOOzL-OhxsY";

// Enhanced error handling for fetch operations
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    console.log('Making Supabase request to:', typeof input === 'string' ? input : input.toString());
    
    // Ensure headers are properly set
    const headers = new Headers(init?.headers);
    headers.set('apikey', SUPABASE_ANON_KEY);
    headers.set('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);
    
    const response = await fetch(input, {
      ...init,
      headers
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

// Create Supabase client with enhanced configuration
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce',
    },
    global: {
      fetch: customFetch,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  }
);

// Add a health check function
export const checkSupabaseConnection = async () => {
  try {
    console.log('Checking Supabase connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase health check failed:', error);
      throw error;
    }
    
    console.log('Supabase connection check successful');
    return true;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    toast.error('Database connection check failed');
    return false;
  }
};

// Initialize connection check
checkSupabaseConnection().catch(console.error);