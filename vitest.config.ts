import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/app/**'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.{ts,tsx}'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: [
            'tests/integration/**/*.test.{ts,tsx}',
            'tests/migrations/**/*.test.{ts,tsx}',
          ],
          globalSetup: ['./tests/setup/testcontainers-postgres.ts'],
          hookTimeout: 120_000,
          testTimeout: 60_000,
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@/.source': path.resolve(__dirname, './tests/helpers/stub-source.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
});
