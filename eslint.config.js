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
  // TypeScript files
  ...tsLint.configs.recommended.map((config) => {
    return {
      ...config,
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        // 我们只对 js 文件进行 `no-unused-vars` 检查，TS 文件由 TypeScript 本身检查。
        "no-unused-vars": ["error", { vars: "all", args: "none" }],
      },
    };
  }),
  {
    ignores: ["**/dist/**", "**/temp/**"],
  },
);
