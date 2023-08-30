import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pugPlugin from "vite-plugin-pug"
import path from 'path'

const options = {}
const locals = { name: "My Pug" }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        // isCustomElement: tag => tag.startsWith('ui-')
      },
    }
  }), pugPlugin(options, locals)],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, './src/UI'),
    },
  },

})
