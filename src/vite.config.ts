import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: https:;
        font-src 'self';
        connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co;
        frame-ancestors 'self' https://*.lovable.app https://*.supabase.co https://*.supabase.in https://*.lovableproject.com;
        frame-src 'self' https://*.lovable.app https://*.supabase.co https://*.supabase.in https://*.lovableproject.com;
        worker-src 'self' blob:;
      `.replace(/\s+/g, ' ').trim(),
      'X-Frame-Options': 'ALLOW-FROM https://*.lovable.app https://*.supabase.co https://*.supabase.in https://*.lovableproject.com'
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});