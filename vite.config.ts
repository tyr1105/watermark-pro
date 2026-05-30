import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/watermark-pro/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
