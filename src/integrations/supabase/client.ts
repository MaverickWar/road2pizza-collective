import { createClient } from '@supabase/supabase-js';
import { networkMonitor } from '@/services/NetworkMonitoringService';

// Supabase configuration
const SUPABASE_URL = "https://zbcadnulavhsmzfvbwtn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiY2FkbnVsYXZoc216ZnZid3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjQzODAsImV4cCI6MjA1MDEwMDM4MH0.hcdXgSWpLnI-QFQOVDOeyrivuSDpFuhrqOOzL-OhxsY";

// Create Supabase client with custom fetch implementation
export const supabase = createClient(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    global: {
      fetch: networkMonitor.monitorFetch,
    },
  }
);

// Function to check session
export const checkSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error.message);
    return null;
  }
  if (session) {
    console.log("Session found:", session);
    return session;
  } else {
    console.log("No session found, user needs to log in.");
    return null;
  }
};