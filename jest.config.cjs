// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true, // 重要：型チェックを軽くする
        diagnostics: false, // 重要：型エラーで落とさない
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}
