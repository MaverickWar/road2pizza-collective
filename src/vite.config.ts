import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Add development specific options
      jsxRuntime: mode === 'development' ? 'classic' : 'automatic',
      devTools: mode === 'development',
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
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
      `.replace(/\s+/g, ' ').trim(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    sourcemap: mode === 'development',
    minify: mode === 'production',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));