export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  testTimeout: 10000,

  transform: {
    "^.+\\.(ts|tsx|js)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.jest.json"
      },
    ],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/dist/$1",
    "^../../DataSource.js$": "<rootDir>/dist/DataSource.js",
  },
  roots: ["<rootDir>/test"],
};
