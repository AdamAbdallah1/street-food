import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/demo/street-food/",
  build: {
    outDir: "dist/demo/street-food",
    emptyOutDir: true,
  },
});