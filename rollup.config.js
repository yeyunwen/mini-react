//@ts-check
import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import replace from "@rollup/plugin-replace";
import alias from "@rollup/plugin-alias";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const packagesDir = path.resolve(__dirname, "packages");
const packageDir = (name) => path.resolve(packagesDir, name);
const pkg = (name) => require(packageDir(`${name}/package.json`));

/**
 * @returns {import("rollup").Plugin[]}
 */
const getBasePlugin = () => {
  return [
    replace({
      __DEV__: true,
      preventAssignment: true,
    }),
    esbuild({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      sourceMap: true,
      minify: false,
      target: "esnext",
    }),
  ];
};

export default defineConfig([
  /******* React *******/
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

    plugins: [...getBasePlugin(), nodeResolve()],
  },
  /******* React dom *******/
  {
    input: packageDir("react-dom/src/index.ts"),
    output: [
      {
        file: packageDir("react-dom/dist/index.js"),
        name: "ReactDOM",
        format: "umd",
      },
      {
        file: packageDir("react-dom/dist/client.js"),
        name: "client",
        format: "umd",
      },
    ],
    plugins: [
      ...getBasePlugin(),
      alias({
        entries: {
          hostConfig: packageDir("react-dom/src/hostConfig.ts"),
        },
      }),
      nodeResolve(),
    ],
  },
  /******* React Reconciler *******/
  {
    input: packageDir("react-reconciler/src/index.ts"),
    output: [
      {
        file: packageDir("react-reconciler/dist/index.cjs.js"),
        format: "cjs",
      },
      {
        file: packageDir("react-reconciler/dist/index.esm.js"),
        format: "esm",
      },
    ],
    external: [
      // ...Object.keys(pkg("react-reconciler").dependencies || {}),
      ...Object.keys(pkg("react-reconciler").devDependencies || {}),
      ...Object.keys(require("./package.json").devDependencies || {}),
    ],
    plugins: [
      ...getBasePlugin(),
      alias({
        entries: {
          hostConfig: packageDir("react-dom/src/hostConfig.ts"),
        },
      }),
      nodeResolve(),
    ],
  },
  /******* Shared *******/
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
    plugins: [...getBasePlugin()],
  },
]);
