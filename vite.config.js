import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-icons';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
