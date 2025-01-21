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
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      
      // Content Security Policy
      'Content-Security-Policy': `
        default-src 'self' https://*.supabase.co https://*.supabase.in https://*.lovable.app https://*.lovableproject.com;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cloudflare.com;
        connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co ws://localhost:* http://localhost:* https://*.lovable.app https://api.lovable.dev https://*.cloudflare.com;
        img-src 'self' data: blob: https://*.supabase.co https://*.cloudflare.com https://*.lovable.app;
        style-src 'self' 'unsafe-inline';
        frame-ancestors 'self' https://*.lovable.app https://*.supabase.co https://*.supabase.in https://*.lovableproject.com;
        frame-src 'self' https://*.supabase.co https://*.supabase.in https://*.lovableproject.com https://*.lovable.app;
        worker-src 'self' blob:;
        child-src 'self' blob: https://*.lovable.app https://*.lovableproject.com;
      `.replace(/\s+/g, ' ').trim(),

      // CORS headers
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token, X-Client-Info',
      'Access-Control-Allow-Credentials': 'true'
    }
  },
  preview: {
    port: 8080,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'credentialless'
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});