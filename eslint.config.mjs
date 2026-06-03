import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "_site/**", "package-lock.json"],
  },
  js.configs.recommended,
  {
    // Browser simulation scripts are loaded via <script> (classic, not ES modules).
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        // Third-party CDN global (bloodglucose loads Chart.js).
        Chart: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
    },
  },
  {
    // bloodglucose borrows islet's updateCells() via a duplicated <script> include —
    // a cross-file global coupling slated for removal in Phase 4.
    files: ["bloodglucose/game.js"],
    languageOptions: { globals: { updateCells: "readonly" } },
  },
];
