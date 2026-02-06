import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },

  css: {
    modules: {
      localsConvention: "camelCase",
      scopeBehaviour: "local",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
    postcss: "./postcss.config.js",
  },

  server: {
    port: 3001,
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

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],

    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },

    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["tests/**", "node_modules/**"],
    },

    testTimeout: 1000000,
  },
});
