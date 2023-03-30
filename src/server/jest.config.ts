export default {
  preset: "ts-jest",
  transform: {
    "\\.[jt]sx?$": "ts-jest",
  },
  //Exclude uuid from Babel transpilation
  moduleNameMapper: {
    "^uuid$": "<rootDir>/node_modules/uuid",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/file_mock.js",
    "\\.(css|less)$": "identity-obj-proxy",
  },

  transformIgnorePatterns: ["/node_modules/"],
  coveragePathIgnorePatterns: ["/node_modules/"],

  setupFilesAfterEnv: [
    "<rootDir>/src/server/test_setup.ts"
  ],
  testEnvironment: "node",

  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "<rootDir>/src/server/coverage",
}
