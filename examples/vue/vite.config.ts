import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vitePluginTdoc from '../../dist/vite-plugin-tdoc.esm.js';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
  vitePluginTdoc()
  ],
})

