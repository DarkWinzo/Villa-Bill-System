const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react').default
const path = require('path')

module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: true,
    cors: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-hot-toast'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
          state: ['zustand']
        }
      }
    }
  },
  base: './',
  publicDir: 'public',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
})