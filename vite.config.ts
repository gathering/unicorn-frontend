/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    [
                        '@locator/babel-jsx/dist',
                        {
                            env: 'development',
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
                replacement: '',
            },
        ],
    },
    server: {
        port: 3000,
    },
});
