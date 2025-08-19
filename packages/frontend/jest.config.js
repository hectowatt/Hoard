export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: "tsconfig.jest.json"
    }]
  },
  moduleNameMapper: {
    "^next/font/google$": "<rootDir>/__mocks__/next/font/google.ts",
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
