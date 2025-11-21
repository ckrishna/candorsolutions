import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const cwd = process.cwd();
  const env = loadEnv(mode, cwd, '');
  
  // Force absolute path resolution for the output directory
  const outDir = path.resolve(cwd, 'var-vault');

  // TRACING: Log environment details
  console.log('==================================================');
  console.log(' [VITE DIAGNOSTICS] Configuration Loading');
  console.log(` [VITE DIAGNOSTICS] Current Working Dir: ${cwd}`);
  console.log(` [VITE DIAGNOSTICS] Target Output Path:  ${outDir}`);
  console.log('==================================================');

  return {
    plugins: [
      react(),
      {
        name: 'diagnostic-logger',
        configResolved(config) {
          console.log(` [VITE DIAGNOSTICS] Config Resolved.`);
          console.log(` [VITE DIAGNOSTICS] Final outDir: ${config.build.outDir}`);
          console.log(` [VITE DIAGNOSTICS] Base URL:     ${config.base}`);
        },
        buildStart() {
          console.log(` [VITE DIAGNOSTICS] Build Process Started...`);
        },
        closeBundle() {
          console.log(` [VITE DIAGNOSTICS] Bundle Closed. Files should be in: ${outDir}`);
        }
      }
    ],
    // Base URL for production
    base: '/var-vault/',
    build: {
      // Use absolute path to ensure strict adherence to location
      outDir: outDir,
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