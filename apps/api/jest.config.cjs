/** apps/api runs in Node, not jsdom — plain ts-jest, no shared browser preset. */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": ["ts-jest", { isolatedModules: true }],
  },
  moduleFileExtensions: ["ts", "js", "json"],
};
