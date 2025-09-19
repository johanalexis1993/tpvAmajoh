import { defineConfig } from 'vite'
export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        index: 'public/index.html',
        register: 'public/register.html',
        tpv: 'public/pos.html'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
