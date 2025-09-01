import { defineConfig } from 'vite'

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: 'public/index.html',
        register: 'public/register.html',
        TPV: 'public/TPV.html'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
