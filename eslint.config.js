export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    ignores: [
      "node_modules/**",
      "docs/screenshots/**",
      "dist/**"
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        CustomEvent: "readonly",
        FormData: "readonly"
      }
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", caughtErrors: "none" }
      ],
      "no-console": "off"
    }
  }
];
