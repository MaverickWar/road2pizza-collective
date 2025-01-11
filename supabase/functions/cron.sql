-- Enable the pg_cron and pg_net extensions if not already enabled
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Schedule the daily analytics email
select cron.schedule(
  'daily-analytics-email',
  '0 0 * * *',  -- Run at midnight every day
  $$
  select net.http_post(
    url:='https://zbcadnulavhsmzfvbwtn.supabase.co/functions/v1/send-analytics-email',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  ) as request_id;
  $$
);