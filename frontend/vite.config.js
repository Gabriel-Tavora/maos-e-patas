import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    // Com VITE_BACKEND_URL definido, tudo que começa com /api vai para o Spring Boot.
    // Assim o navegador fala só com o Vite e não é preciso liberar CORS no backend.
    server: env.VITE_BACKEND_URL
      ? { proxy: { "/api": { target: env.VITE_BACKEND_URL, changeOrigin: true } } }
      : undefined,
  };
});
