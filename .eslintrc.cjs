/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        commonjs: true,
        es6: true,
    },
    ignorePatterns: ["*.css", "!**/.server", "!**/.client", "*.gen.ts"],

    // Base config
    extends: ["eslint:recommended"],

    overrides: [
        // React
        {
            files: ["**/*.{js,jsx,ts,tsx}"],
            plugins: ["react", "jsx-a11y"],
            extends: [
                "plugin:react/recommended",
                "plugin:react/jsx-runtime",
                "plugin:react-hooks/recommended",
                "plugin:jsx-a11y/recommended",
            ],
            rules: {
                "react/prop-types": "off",
                "jsx-a11y/media-has-caption": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/ban-ts-comment": "off",
            },
            settings: {
                react: {
                    version: "detect",
                },
                "import/resolver": {
                    typescript: {},
                },
            },
        },

        // Typescript
        {
            files: ["**/*.{ts,tsx}"],
            plugins: ["@typescript-eslint", "import"],
            rules: {
                "react/prop-types": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/ban-ts-comment": "off",
            },
            parser: "@typescript-eslint/parser",
            settings: {
                "import/internal-regex": "^~/",
                "import/resolver": {
                    node: {
                        extensions: [".ts", ".tsx"],
                    },
                    typescript: {
                        alwaysTryTypes: true,
                    },
                },
            },
            extends: ["plugin:@typescript-eslint/recommended", "plugin:import/recommended", "plugin:import/typescript"],
        },

        // Node
        {
            files: [".eslintrc.cjs"],
            env: {
                node: true,
            },
        },
    ],
};
