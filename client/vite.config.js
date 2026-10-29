import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev-only proxy target. The client calls /api and /uploads on its own origin in
 * development, and Vite forwards them here — which avoids CORS entirely, so it also
 * works against a deployed API. Point it somewhere else with:
 *   DEV_API_PROXY=https://your-api.onrender.com npm run dev
 * (In a built front end the API origin comes from VITE_API_URL instead.)
 */
const proxyTarget = process.env.DEV_API_PROXY || 'http://localhost:5050';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: proxyTarget, changeOrigin: true, secure: false },
      '/uploads': { target: proxyTarget, changeOrigin: true, secure: false },
    },
  },
  build: { outDir: 'dist', chunkSizeWarningLimit: 1200 },
});
