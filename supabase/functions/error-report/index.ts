import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ErrorReport {
  timestamp: string;
  errors: any[];
  analyticsData: any[];
  systemState: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Fetch error logs from analytics_metrics
    const { data: analyticsData, error: analyticsError } = await supabase
      .from("analytics_metrics")
      .select("*")
      .eq("metric_name", "error")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (analyticsError) {
      console.error("Error fetching analytics data:", analyticsError);
    }

    const report: ErrorReport = {
      timestamp: new Date().toISOString(),
      errors: analyticsData || [],
      analyticsData: [],
      systemState: {}
    };

    // Generate HTML report
    const htmlReport = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .error { background: #fff0f0; padding: 10px; margin: 10px 0; border-left: 4px solid #ff0000; }
            .timestamp { color: #666; font-size: 0.9em; }
            .details { margin-left: 20px; }
          </style>
        </head>
        <body>
          <h1>Error Report - ${new Date().toLocaleString()}</h1>
          
          <h2>Recent Errors (Last 100)</h2>
          ${report.errors.map(error => `
            <div class="error">
              <div class="timestamp">${new Date(error.timestamp).toLocaleString()}</div>
              <div class="details">
                <strong>Metric Name:</strong> ${error.metric_name}<br>
                <strong>Value:</strong> ${error.metric_value}<br>
                <strong>HTTP Status:</strong> ${error.http_status || 'N/A'}<br>
                <strong>Endpoint:</strong> ${error.endpoint_path || 'N/A'}<br>
                <strong>Response Time:</strong> ${error.response_time ? `${error.response_time}ms` : 'N/A'}<br>
                <pre>${JSON.stringify(error.metadata, null, 2)}</pre>
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Error Reports <onboarding@resend.dev>",
        to: ["richgiles@hotmail.co.uk"],
        subject: `Error Report - ${new Date().toLocaleString()}`,
        html: htmlReport,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in error-report function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);