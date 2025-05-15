import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Post-AR/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: 'src/assets'
})
