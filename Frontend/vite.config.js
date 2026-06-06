import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev proxy: forward /api requests to the backend tunnel to avoid CORS during development.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy any /api/* request to the backend URL used in apiPath.tsx
      '/api': {
        target: 'https://zhl2kcpp-5000.inc1.devtunnels.ms',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // keep the /api prefix
      },
    },
  },
})
