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
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, apikey, x-client-info',
      'Access-Control-Allow-Credentials': 'true',
      
      // Cache control - Development-friendly
      'Cache-Control': mode === 'development' 
        ? 'no-store, no-cache, must-revalidate'
        : 'public, max-age=31536000',
      
      // Security headers
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // More permissive CSP for development
      'Content-Security-Policy': mode === 'development'
        ? "default-src 'self' * data: 'unsafe-inline' 'unsafe-eval' blob:;"
        : "default-src 'self' https://zbcadnulavhsmzfvbwtn.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; font-src 'self' data:; connect-src 'self' https://zbcadnulavhsmzfvbwtn.supabase.co ws://localhost:*;"
    },
    cors: mode === 'development' ? true : {
      origin: 'https://zbcadnulavhsmzfvbwtn.supabase.co',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'apikey', 'x-client-info'],
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