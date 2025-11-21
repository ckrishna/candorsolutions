import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: './', // Use relative paths for subdirectory deployment
    define: {
      // Ensure API_KEY is always a string
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})