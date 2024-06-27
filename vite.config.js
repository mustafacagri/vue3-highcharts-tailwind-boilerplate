import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import commonjs from 'vite-plugin-commonjs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {},
      },
    }),
    commonjs(),
    nodePolyfills(),
    Pages({}),
    Layouts(),
    Components({
      /* options */
    }),
    AutoImport({
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
      imports: ['vue', 'vue-router', 'pinia'],
      vueTemplate: true,
    }),
    DefineOptions(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/scss/parts/main.scss";`,
      },
    },
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm-bundler.js',
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    port: 5018, // Change this to your desired port number
  },
})
