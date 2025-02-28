import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: isProduction 
            ? 'https://evoback-c2a4.onrender.com'
            : 'http://localhost:5000',
          changeOrigin: true,
          secure: isProduction,
          headers: isProduction ? {
            'Origin': 'https://evofront.onrender.com',
            'Referer': 'https://evofront.onrender.com'
          } : {
            'Origin': 'http://localhost:5173'
          }
        }
      }
    },
    build: {
      outDir: 'dist', // Ensure output is 'dist' for Render
      assetsDir: 'assets',
    },
    optimizeDeps: {
      include: ['axios']
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  };
});