/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/.history"],
  moduleDirectories: ["node_modules", "<rootDir>"],
};
