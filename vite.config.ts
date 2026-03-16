import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["admin.pharmacitymart.com"],
  },
  preview: {
    allowedHosts: ["admin.pharmacitymart.com"],
  },
  resolve: {
    alias: {
      "~": "/src",
    },
  },
});
