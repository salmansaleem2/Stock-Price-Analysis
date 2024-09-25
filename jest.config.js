// jest.config.js
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/app/jest.setup.js"],
  moduleNameMapper: {
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
