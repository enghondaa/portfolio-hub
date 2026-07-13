/**
 * Shared Jest config for TypeScript packages (non-Next.js).
 * Next.js apps use next/jest instead (see each app's jest.config.cjs).
 */
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true, tsconfig: { jsx: "react-jsx" } }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
