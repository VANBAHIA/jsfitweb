import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Build otimizado para produção
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs em produção
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes em chunks
          'react-vendor': ['react', 'react-dom'],
          'lucide': ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  
  // Server de desenvolvimento
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  
  // Preview (servidor de produção local)
  preview: {
    port: 4173
  }
})
