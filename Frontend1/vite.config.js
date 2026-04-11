import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // ✅ expose to network
    port: 5173,        // optional but recommended
  },
  build: {
    chunkSizeWarningLimit: 1600, // ✅ Increases limit to hide the warning
  }
})
