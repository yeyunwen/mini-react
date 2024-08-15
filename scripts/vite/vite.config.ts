import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import replace from "@rollup/plugin-replace";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const packagesDir = path.resolve(__dirname, "../../", "packages");
const packageDir = (name) => path.resolve(packagesDir, name);
console.log('packageDir("react")', packageDir("react"));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    replace({
      __DEV__: true,
      preventAssignment: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: "react",
        replacement: packageDir("react"),
      },
      {
        find: "react-dom/client",
        replacement: packageDir("react-dom/src/index.ts"),
      },
    ],
  },
});
