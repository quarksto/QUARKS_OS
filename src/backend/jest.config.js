module.exports = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    transformIgnorePatterns: ['/node_modules/'],
    // Setup files if needed (e.g. for env vars)
    // setupFiles: ['dotenv/config'],
};
