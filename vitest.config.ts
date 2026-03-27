import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/app/**"],
    },
  },
  resolve: {
    alias: {
      "@/.source": path.resolve(__dirname, "./tests/helpers/stub-source.ts"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
