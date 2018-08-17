module.exports = {
  testURL: 'http://localhost:8080/',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '\\.(svg|png)$': '<rootDir>/config/fileTransform.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupTestFrameworkScriptFile: '<rootDir>/src/setupTests.ts',
  globals: {
    'ts-jest': {
      skipBabel: true,
      tsConfigFile: 'tsconfig.jest.json',
    },
  },
};
