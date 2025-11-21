import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // Use relative paths ('./') so assets are loaded relative to the index.html location.
    // This fixes the issue where the app looks for /assets instead of /var-vault/assets.
    base: './', 
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})