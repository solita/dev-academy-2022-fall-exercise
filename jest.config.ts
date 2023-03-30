import type { Config } from "jest"

const config: Config = {
  projects: ["<rootDir>/src/client/", "<rootDir>/src/server/"],

  transformIgnorePatterns: ["/node_modules/"],
  coveragePathIgnorePatterns: ["/node_modules/"],

  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  watchPathIgnorePatterns: ['globalConfig'],
}

export default config
