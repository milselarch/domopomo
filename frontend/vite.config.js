import { defineConfig } from "vite";
import wails from "@wailsio/runtime/plugins/vite";
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [wails("./bindings"), vue()],
});
