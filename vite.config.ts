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
      // CORS headers - More permissive for development
      'Access-Control-Allow-Origin': mode === 'development' ? '*' : 'https://zbcadnulavhsmzfvbwtn.supabase.co',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      
      // Cache control - Development-friendly
      'Cache-Control': mode === 'development' 
        ? 'no-store, no-cache, must-revalidate'
        : 'public, max-age=31536000',
      
      // Security headers - Relaxed for development
      'Strict-Transport-Security': mode === 'development' ? '' : 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // More permissive CSP for development
      'Content-Security-Policy': mode === 'development'
        ? "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * ws: wss:;"
        : "default-src 'self' https://zbcadnulavhsmzfvbwtn.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; font-src 'self' data:; connect-src 'self' https://zbcadnulavhsmzfvbwtn.supabase.co ws://localhost:* wss://zbcadnulavhsmzfvbwtn.supabase.co;"
    },
    cors: mode === 'development' ? true : {
      origin: 'https://zbcadnulavhsmzfvbwtn.supabase.co',
      methods: ['GET', 'HEAD', 'PUT', PATCH', 'POST', 'DELETE'],
      allowedHeaders: ['*'],
      credentials: true,
    }
  },
  preview: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
    sourcemap: true,
    assetsDir: '_assets',
    modulePreload: {
      polyfill: true,
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));