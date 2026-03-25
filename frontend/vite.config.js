import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $components: path.resolve(__dirname, './src/components'),
      $pages: path.resolve(__dirname, './src/pages'),
      $services: path.resolve(__dirname, './src/services'),
      $stores: path.resolve(__dirname, './src/stores'),
      $lib: path.resolve(__dirname, './src/lib')
    }
  },
  server: {
    host: true,
    proxy: {
      '/api': process.env.BACKEND_URL || 'http://localhost:3000'
    }
  }
})
