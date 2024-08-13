import globals from "globals";
import pluginJs from "@eslint/js";
import tsLint from "typescript-eslint";

// 实用的工具函数，为我们编写扁平化的eslint配置提供了良好的类型提示
export default tsLint.config(
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
    },
  },
  pluginJs.configs.recommended,
  ...tsLint.configs.recommended,
  {
    ignores: ["**/dist/**", "**/temp/**"],
  }
);
