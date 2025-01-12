import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { networkMonitor } from '@/services/NetworkMonitoringService';

const SUPABASE_URL = "https://zbcadnulavhsmzfvbwtn.supabase.co";

// Use the service role key in server-side code (NEVER expose it to the client)
const SUPABASE_SERVICE_ROLE_KEY = "<your-service-role-key>"; // Replace with actual service role key

// Create Supabase client with custom fetch implementation for monitoring
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_SERVICE_ROLE_KEY,
  {
    global: {
      fetch: networkMonitor.monitorFetch,
    },
  }
);

// Function to get the authenticated session (access token) for user-specific requests
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error.message);
    return null;
  }
  
  return session;
};

// Example function to insert data with user authentication
export const insertData = async (data: any) => {
  const session = await getSession();
  
  if (!session) {
    console.log("User not authenticated");
    return;
  }

  const { data: result, error } = await supabase
    .from('analytics_metrics')
    .insert(data, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      }
    });

  if (error) {
    console.error("Error inserting data:", error.message);
  } else {
    console.log("Data inserted:", result);
  }
};