module.exports = {
    preset: 'ts-jest/presets/default-esm', // or 'ts-jest/presets/default'
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['<rootDir>/tests/**/*.(test|spec).(ts|js)'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup-envs.ts'],
};