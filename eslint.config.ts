/**
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
    // Ignore patterns
    { ignores: ["*.css", "!**/.server", "!**/.client", "*.gen.ts"] },

    // React config for JS/JSX/TS/TSX files
    {
        files: ["src/**/*.{js,jsx,ts,tsx}"],
        plugins: { react: reactPlugin, "react-hooks": reactHooksPlugin, "jsx-a11y": jsxA11yPlugin },
        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
                projectService: true,
            },
            globals: { browser: true, es6: true },
        },
        settings: { react: { version: "detect" }, "import/resolver": { typescript: {} } },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactPlugin.configs["jsx-runtime"].rules,
            ...reactHooksPlugin.configs.recommended.rules,
            ...jsxA11yPlugin.configs.recommended.rules,
            "react/prop-types": "off",
            "jsx-a11y/media-has-caption": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",
        },
    },

    // TypeScript config
    {
        files: ["src/**/*.{ts,tsx}"],
        plugins: { "@typescript-eslint": tsPlugin, import: importPlugin },
        languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: "latest", sourceType: "module" } },
        settings: {
            "import/internal-regex": "^~/",
            "import/resolver": { node: { extensions: [".ts", ".tsx"] }, typescript: { alwaysTryTypes: true } },
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...importPlugin.configs.recommended.rules,
            ...importPlugin.configs.typescript.rules,
            "react/prop-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-deprecated": "error",
        },
    },

    // Node config
    { files: [".eslintrc.cjs"], languageOptions: { globals: { node: true } } },
];
