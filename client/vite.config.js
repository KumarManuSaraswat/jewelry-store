import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target:
            env.VITE_API_URL || "https://orniva-jewelry-store.onrender.com",
          changeOrigin: true,
          // Localhost and 127.0.0.1 share this development-only API proxy.
          // Authorization headers are forwarded; production uses the API directly.
          configure(proxy) {
            proxy.on("proxyReq", (request) => request.removeHeader("origin"));
          },
        },
      },
    },
  };
});
