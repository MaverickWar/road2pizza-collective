import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch analytics data
    const [logsResponse, metricsResponse] = await Promise.all([
      supabase.from('analytics_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('analytics_metrics')
        .select('*')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ]);

    if (logsResponse.error) throw logsResponse.error;
    if (metricsResponse.error) throw metricsResponse.error;

    const logs = logsResponse.data;
    const metrics = metricsResponse.data;

    // Calculate statistics
    const totalErrors = logs.filter(log => log.type === 'error').length;
    const resolvedIssues = logs.filter(log => log.status === 'resolved').length;
    const criticalIssues = logs.filter(log => log.severity === 'critical').length;

    // Create email HTML
    const emailHtml = `
      <h1>Daily Analytics Summary</h1>
      <h2>Last 24 Hours Overview</h2>
      <ul>
        <li>Total Errors: ${totalErrors}</li>
        <li>Resolved Issues: ${resolvedIssues}</li>
        <li>Critical Issues: ${criticalIssues}</li>
      </ul>
      <h2>Recent Critical Issues</h2>
      <ul>
        ${logs
          .filter(log => log.severity === 'critical')
          .map(log => `<li>${log.message}</li>`)
          .join('')}
      </ul>
      <p>
        <a href="${SUPABASE_URL}/analytics">View Full Analytics Dashboard</a>
      </p>
    `;

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'analytics@yourdomain.com',
        to: 'admin@yourdomain.com',
        subject: 'Daily Analytics Summary',
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    return new Response(
      JSON.stringify({ message: 'Analytics email sent successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in analytics email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});