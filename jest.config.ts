/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  preset: "ts-jest",
  transform: {
    "\\.[jt]sx?$": "ts-jest",
  },
  //Exclude uuid from Babel transpilation
  moduleNameMapper: {
    "^uuid$": "<rootDir>/node_modules/uuid",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/file_mock.js",
    "\\.(css|less)$": "identity-obj-proxy",
  },

  transformIgnorePatterns: ["/node_modules/"],
  coveragePathIgnorePatterns: ["/node_modules/"],

  //ignore files in __tests__/utils from testing
  testPathIgnorePatterns: ["<rootDir>/__tests__/utils/"],

  testEnvironment: "js-dom",

  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
}
