import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "lib/main.ts",
      name: "MyLib",
      fileName: "main",
    },
    rollupOptions: {
      external: ["@jscad/modeling"],
    },
  },
});
