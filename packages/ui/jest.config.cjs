const base = require("@portfolio/config/jest/base.cjs");

module.exports = {
  ...base,
  rootDir: __dirname,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
