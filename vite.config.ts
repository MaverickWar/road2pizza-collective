import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.lovable.app https://*.supabase.co https://*.supabase.in https://cdn.gpteng.co;
        style-src 'self' 'unsafe-inline';
        img-src * data: blob:;
        frame-src 'self' https://*.lovable.app https://*.supabase.co https://*.supabase.in https://*.lovableproject.com;
        frame-ancestors 'self' https://*.lovable.app https://*.supabase.co https://*.supabase.in https://*.lovableproject.com https://lovable.dev;
        connect-src 'self' https://*.supabase.co https://*.supabase.in https://*.lovable.dev wss://*.supabase.co https://*.lovable.app https://*.lovableproject.com https://*.dicebear.com https://zbcadnulavhsmzfvbwtn.supabase.co;
        worker-src 'self' blob:;
        font-src 'self' data:;
        media-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        manifest-src 'self';
      `.replace(/\s+/g, ' ').trim(),
    },
  },
});