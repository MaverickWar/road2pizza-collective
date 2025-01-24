import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, username } = await req.json();

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Road2Pizza <welcome@road2pizza.com>',
        to: [email],
        subject: 'Welcome to Road2Pizza! 🍕',
        html: `
          <h1>Welcome to Road2Pizza, ${username}!</h1>
          <p>We're excited to have you join our community of pizza enthusiasts!</p>
          <p>Get started by:</p>
          <ul>
            <li>Exploring pizza recipes</li>
            <li>Joining discussions in our forum</li>
            <li>Sharing your own pizza creations</li>
          </ul>
          <p>If you have any questions, feel free to reach out to our community!</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send welcome email');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in send-welcome-email function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});