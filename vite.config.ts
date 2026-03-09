import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 3001,
    // proxy: {
    //   "/api": {
    //     target: "https://pemdigitaldevapi.akersolutions.com",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },

  build: {
    cssMinify: "lightningcss",
    cssCodeSplit: true,

    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
