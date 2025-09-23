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
    target: 'esnext',
    minify: 'esbuild',
    emptyOutDir: true,
  },
  base: './',
  publicDir: 'public'
})