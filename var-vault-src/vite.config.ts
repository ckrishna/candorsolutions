import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // Base URL for production - essential if deploying to a subdirectory named /var-vault/
    base: '/var-vault/',
    build: {
      // Simple string 'var-vault' ensures output goes to ./var-vault in the current project root
      // avoiding permission issues with parent directories or path resolution errors.
      outDir: 'var-vault',
      emptyOutDir: true
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