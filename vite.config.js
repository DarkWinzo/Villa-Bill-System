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
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
          state: ['zustand'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    }
  },
  base: './',
  publicDir: 'public'
})