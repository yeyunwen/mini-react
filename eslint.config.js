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
  ...tsLint.configs.recommended.map((config) => {
    return {
      ...config,
      rules: {
        ...config.rules,
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
      },
    };
  }),
  {
    ignores: ["**/dist/**", "**/temp/**"],
  },
);
