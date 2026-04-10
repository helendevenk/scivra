import nextConfig from "eslint-config-next";

export default [
  ...nextConfig,
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
