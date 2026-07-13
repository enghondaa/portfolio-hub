import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** Shared flat ESLint config for non-Next.js TypeScript packages/apps. */
export const baseConfig = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", ".next/**", "build/**", "storybook-static/**"],
  },
  {
    // CommonJS config files (jest.config.cjs, etc.) run directly under Node.
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  }
);
