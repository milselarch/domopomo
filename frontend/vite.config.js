import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import wails from "@wailsio/runtime/plugins/vite";
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [wails("./bindings"), vue()],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    minify: "esbuild",
    cssMinify: "esbuild",
  },
});
