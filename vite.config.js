import { defineConfig } from 'vite'
import { resolve } from 'path'
export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: { port: 5173, open: '/index.html' },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        register: resolve(__dirname, 'register.html'),
        tpv: resolve(__dirname, 'pos.html')
      }
    },
    target: 'es2020'
  }
})
