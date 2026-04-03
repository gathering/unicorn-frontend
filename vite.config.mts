/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import crypto from "crypto";
import path from "path";
import { defineConfig, type Plugin } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

const buildVersion = crypto.randomUUID();

function versionFilePlugin(): Plugin {
    return {
        name: "version-file",
        apply: "build",
        generateBundle() {
            this.emitFile({
                type: "asset",
                fileName: "version.json",
                source: JSON.stringify({ version: buildVersion }),
            });
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteTsconfigPaths(), versionFilePlugin()],
    define: {
        __BUILD_VERSION__: JSON.stringify(buildVersion),
    },
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
});
