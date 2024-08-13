//@ts-check
import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const packagesDir = path.resolve(__dirname, "packages");
const packageDir = (name) => path.resolve(packagesDir, name);
const pkg = (name) => require(packageDir(`${name}/package.json`));

export default defineConfig([
  {
    input: packageDir("react/src/index.ts"),
    output: [
      {
        file: packageDir("react/dist/index.cjs.js"),
        format: "cjs",
      },
      {
        file: packageDir("react/dist/index.esm.js"),
        format: "esm",
      },
    ],
    external: [
      ...Object.keys(pkg("react").dependencies || {}),
      ...Object.keys(pkg("react").devDependencies || {}),
      ...Object.keys(require("./package.json").devDependencies || {}),
      ...["node:fs", "node:path"],
    ],
    plugins: [
      esbuild({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
        sourceMap: true,
        minify: false,
        target: "esnext",
      }),
    ],
  },
  {
    input: packageDir("shared/src/index.ts"),
    output: [
      {
        file: packageDir("shared/dist/index.cjs.js"),
        format: "cjs",
      },
      {
        file: packageDir("shared/dist/index.esm.js"),
        format: "esm",
      },
    ],
    external: [
      ...Object.keys(pkg("shared").dependencies || {}),
      ...Object.keys(pkg("shared").devDependencies || {}),
      ...Object.keys(require("./package.json").devDependencies || {}),
    ],
    plugins: [
      esbuild({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
        sourceMap: true,
        minify: false,
        target: "esnext",
      }),
    ],
  },
]);
