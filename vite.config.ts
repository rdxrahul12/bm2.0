import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
base: mode === "production" ? "/bm2.0/" : "/",
  server: {
  host: "::",
    port: 8080,
      hmr: {
    overlay: false,
    },
},
plugins: [react()],
  resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    },
},
}));
