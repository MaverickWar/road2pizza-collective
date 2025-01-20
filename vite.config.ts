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
      'Access-Control-Allow-Headers': '*',
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
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      
      // CSP - More permissive to allow Supabase connections
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval'; connect-src * ws: wss:; img-src * data: blob:;"
    },
    cors: true
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