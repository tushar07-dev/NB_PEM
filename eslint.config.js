import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import tailwind from "eslint-plugin-tailwindcss";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-refresh": reactRefresh,
      tailwindcss: tailwind,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      ...reactHooks.configs.recommended.rules,
      "tailwindcss/classnames-order": "off", // Let Prettier handle sorting
      "tailwindcss/enforces-negative-arbitrary-values": "error",
      "tailwindcss/enforces-shorthand": "warning",
      "tailwindcss/no-custom-classname": "off",
    },
  },
  {
    files: ["components/ui/**/*.{ts,tsx}", "lib/**/*.ts", "hooks/**/*.ts"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
]);
