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
      // CORS headers - More specific origins
      'Access-Control-Allow-Origin': mode === 'development' 
        ? 'http://localhost:8080' 
        : 'https://api.lovable.dev',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Credentials': 'true',
      
      // Cache control
      'Cache-Control': mode === 'development' 
        ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
        : 'public, max-age=31536000, immutable',
      'Surrogate-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0',
      
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
      
      // Cookie security
      'Set-Cookie': 'HttpOnly; Secure; SameSite=Strict',
      
      // CSP - Configured for Supabase
      'Content-Security-Policy': "default-src 'self' https://*.supabase.co https://*.supabase.in; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co ws://localhost:* http://localhost:* https://api.lovable.dev; img-src 'self' data: blob: https://*.supabase.co; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';"
    },
    cors: {
      origin: mode === 'development' 
        ? 'http://localhost:8080' 
        : 'https://api.lovable.dev',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
      allowedHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type']
    }
  },
  preview: {
    host: "::",
    port: 8080
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