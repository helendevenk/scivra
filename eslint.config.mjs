import nextConfig from "eslint-config-next";

export default [
  ...nextConfig,
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
];
