//@ts-check
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

export default defineConfig([
  {
    input: "temp/packages/react/src/index.d.ts",
    output: {
      file: "packages/react/dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
  {
    input: "temp/packages/shared/src/index.d.ts",
    output: {
      file: "packages/shared/dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
]);
