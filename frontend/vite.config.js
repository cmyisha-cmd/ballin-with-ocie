import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use VITE_API_BASE env variable or default to same origin
const apiBase = process.env.VITE_API_BASE || ''

export default defineConfig({
  plugins: [react()],
  define: {
    __API_BASE__: JSON.stringify(apiBase)
  },
  server: {
    port: 5173,
    host: true
  }
})
