import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
    headers: {
      // CORS headers
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Credentials': 'true',
      
      // Cache control
      'Cache-Control': mode === 'development' 
        ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
        : 'public, max-age=31536000, immutable',
      'Surrogate-Control': 'no-store',
      'Pragma': mode === 'development' ? 'no-cache' : 'public',
      'Expires': mode === 'development' ? '0' : '31536000',
      
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'ALLOW-FROM https://*.lovableproject.com https://*.lovable.app https://*.supabase.co https://*.supabase.in',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      
      // CSP - Allow necessary domains and frame ancestors
      'Content-Security-Policy': `
        default-src 'self' https://*.supabase.co https://*.supabase.in https://*.lovable.app https://*.lovableproject.com;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cloudflare.com;
        connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co ws://localhost:* http://localhost:* https://*.lovable.app https://api.lovable.dev https://*.cloudflare.com;
        img-src 'self' data: blob: https://*.supabase.co;
        style-src 'self' 'unsafe-inline';
        frame-ancestors 'self' https://*.lovable.app https://*.supabase.co https://*.supabase.in https://*.lovableproject.com;
        frame-src 'self' https://*.supabase.co https://*.supabase.in https://*.lovableproject.com https://*.lovable.app;
        worker-src 'self' blob:;
      `.replace(/\s+/g, ' ').trim()
    },
    cors: {
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
      allowedHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type']
    }
  },
  preview: {
    host: "::",
    port: 8080,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    },
    sourcemap: true,
    assetsDir: '_assets',
    modulePreload: {
      polyfill: true
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
}));