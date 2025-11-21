import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration for VAR Vault
export default defineConfig(({ mode }) => {
  const cwd = process.cwd();
  const env = loadEnv(mode, cwd, '');
  
  return {
    plugins: [react()],
    // Base URL set to './' to ensure assets load correctly on any repository name or custom domain
    base: './',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true
    },
    server: {
      proxy: {
        '/api-proxy': {
          target: 'https://fantasy.premierleague.com/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy/, ''),
        },
      },
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})