import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/packages/timer',
    test: {
        name: '@rd/timer',
        watch: true,
        globals: true,
        environment: 'jsdom',
        include: [
            '{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        ],
        reporters: ['default'],
        coverage: {
            reportsDirectory: './test-output/vitest/coverage',
            provider: 'v8' as const,
        },
    },
}));
