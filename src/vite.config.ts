import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Listen on all network interfaces
    port: 8080,
    middlewareMode: false, // Ensure normal mode (not middleware)
    headers: {
      'Cache-Control': 'no-store', // Disable caching during development
    },
  },
  preview: {
    host: "::",
    port: 8080, // Port for preview mode (should be the same for consistency)
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
    sourcemap: true, // Enable sourcemaps for easier debugging
    assetsDir: '_assets', // Keep assets in a separate directory
    modulePreload: {
      polyfill: true, // Polyfill module preload for older browsers
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(), // Activate componentTagger only in development mode
  ].filter(Boolean), // Remove null/undefined plugins
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Resolve @ to src directory
    },
  },
}));