/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  preset: "ts-jest",
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  //Exclude node_modules from transform
  transformIgnorePatterns: ["/node_modules/"],
  //Exclude uuid from Babel transpilation
  moduleNameMapper: {
    "^uuid$": "<rootDir>/node_modules/uuid",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/file_mock.js",
    "\\.(css|less)$": "identity-obj-proxy",
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
}
