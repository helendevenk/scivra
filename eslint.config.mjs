import nextConfig from "eslint-config-next";
import tseslint from "typescript-eslint";

export default [
  ...nextConfig,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
