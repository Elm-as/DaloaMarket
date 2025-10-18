import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ajout d'alias pour simplifier les imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor_react';
            if (id.includes('@supabase') || id.includes('supabase')) return 'vendor_supabase';
            if (id.includes('lucide-react') || id.includes('lucide')) return 'vendor_icons';
            if (id.includes('firebase')) return 'vendor_firebase';
            return 'vendor_misc';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  server: {
    // Permet de définir le port via une variable d'environnement ou par défaut 5173
    port: Number(process.env.VITE_PORT) || 5173,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false, // Utile pour éviter les erreurs SSL en dev
      },
    },
  },
});