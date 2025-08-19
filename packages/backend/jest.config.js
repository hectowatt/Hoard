export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.(ts|tsx|js)$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/dist/$1",
    "^../../DataSource.js$": "<rootDir>/dist/DataSource.js",
  },

  roots: ["<rootDir>/dist", "<rootDir>/test"],
};
