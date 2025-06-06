import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  optimizeDeps: {
    exclude: ["@xenova/transformers"],
  },
  worker: {
    format: 'es'
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      'onnxruntime-web': 'onnxruntime-web/dist/ort.min.js'
    }
  },
  assetsInclude: ['**/*.wasm'],
});
