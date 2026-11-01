import { defineConfig } from 'vite'

export default defineConfig({
  root: 'pages',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})