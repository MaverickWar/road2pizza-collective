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
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Content-Security-Policy': `
        default-src 'self' https://*.supabase.co https://*.supabase.in;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.lovable.dev https://*.cloudflare.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://*.cloudflare.com;
        frame-src 'self' https://*.lovable.app https://*.supabase.co https://*.supabase.in https://*.lovableproject.com;
        frame-ancestors 'self' https://*.lovable.app https://*.supabase.co https://*.supabase.in https://*.lovableproject.com;
        connect-src 'self' https://*.supabase.co https://*.supabase.in https://*.lovable.dev wss://*.supabase.co;
        worker-src 'self' blob:;
        font-src 'self' data:;
        media-src 'self';
      `,
      'X-Frame-Options': 'ALLOW-FROM https://*.lovable.app https://*.lovableproject.com',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    },
    proxy: {
      '/api': {
        target: 'https://api.lovable.dev',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});