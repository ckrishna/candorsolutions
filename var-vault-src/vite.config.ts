import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const cwd = process.cwd();
  const env = loadEnv(mode, cwd, '');
  
  // Switch to standard 'dist' to avoid CI/CD mismatch issues
  const outDirName = 'dist';
  const outDir = path.resolve(cwd, outDirName);

  // DIAGNOSTICS: Log environment details immediately
  console.log('\n\n==================================================');
  console.log(' [VITE DIAGNOSTICS] INITIALIZATION');
  console.log(` [VITE DIAGNOSTICS] Mode:            ${mode}`);
  console.log(` [VITE DIAGNOSTICS] Current Dir:     ${cwd}`);
  console.log(` [VITE DIAGNOSTICS] Output Path:     ${outDir}`);
  console.log('==================================================\n');

  return {
    plugins: [
      react(),
      {
        name: 'diagnostic-logger',
        configResolved(config) {
          console.log(` [VITE DIAGNOSTICS] Config Resolved`);
          console.log(` [VITE DIAGNOSTICS] Base URL: ${config.base}`);
          console.log(` [VITE DIAGNOSTICS] OutDir:  ${config.build.outDir}`);
        },
        closeBundle() {
          console.log('\n==================================================');
          console.log(' [VITE DIAGNOSTICS] BUILD COMPLETE - VERIFYING FILES');
          console.log('==================================================');
          
          try {
            if (fs.existsSync(outDir)) {
              console.log(` \u2705 Directory exists: ${outDir}`);
              const files = fs.readdirSync(outDir);
              console.log(` \uD83D\uDCC1 Total files/folders: ${files.length}`);
              files.forEach(file => {
                const filePath = path.join(outDir, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                   console.log(`    \uD83D\uDCC2 [DIR]  ${file}`);
                   // List submenu for assets usually
                   try {
                     const subFiles = fs.readdirSync(filePath);
                     subFiles.forEach(sf => console.log(`        \u2514\u2500 ${sf}`));
                   } catch (e) {}
                } else {
                   console.log(`    \uD83D\uDCC4 [FILE] ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
                }
              });
            } else {
              console.error(` \u274C ERROR: Output directory NOT found at: ${outDir}`);
              console.error(`    Current directory contents:`);
              fs.readdirSync(cwd).forEach(f => console.log(`    - ${f}`));
            }
          } catch (error) {
            console.error(' [VITE DIAGNOSTICS] Error inspecting output:', error);
          }
          console.log('==================================================\n');
        }
      }
    ],
    // Base URL for production (keep this as your repo name if using GH Pages)
    base: '/var-vault/',
    build: {
      outDir: outDir,
      emptyOutDir: true,
      sourcemap: true // Enable sourcemaps to help debug
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