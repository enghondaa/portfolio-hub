import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** Shared flat ESLint config for non-Next.js TypeScript packages/apps. */
export const baseConfig = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", ".next/**", "build/**"],
  }
);
