import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./src",
  build: {
    outDir: "../dist",
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      "/graphql": {
        target: process.env.GRAPHQL_PROXY_TARGET || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
