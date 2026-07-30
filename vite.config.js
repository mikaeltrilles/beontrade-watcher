import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration de Vite pour l'application React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
  },
})
