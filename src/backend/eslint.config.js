const js = require("@eslint/js");
const nodePlugin = require("eslint-plugin-node");
const prettierConfig = require("eslint-config-prettier");
const globals = require("globals");

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        plugins: {
            node: nodePlugin,
        },
        rules: {
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-console": "off",
            "no-undef": "error",
            ...prettierConfig.rules,
        },
    },
    {
        files: ["**/__tests__/**/*.js", "**/*.test.js"],
        languageOptions: {
            globals: {
                ...require("globals").jest,
            },
        },
    },
    {
        ignores: ["node_modules/", "dist/", "coverage/", "**/temp_route_snippet.js"],
    },
];
