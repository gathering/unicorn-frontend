/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    [
                        "@locator/babel-jsx/dist",
                        {
                            env: "development",
                        },
                    ],
                ],
            },
        }),
        viteTsconfigPaths(),
    ],
    resolve: {
        alias: [
            {
                find: /^~/,
                replacement: "",
            },
            {
                find: "@",
                replacement: path.join(__dirname, "src"),
            },
        ],
    },
    server: {
        port: 3000,
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            },
        },
    },
});
