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
    // bloodglucose borrows islet's updateCells() via a duplicated <script> include.
    // This fragile cross-file coupling is intentionally left in place (working,
    // isolated, and risky to rewrite without interactive QA).
    files: ["src/bloodglucose/game.js"],
    languageOptions: { globals: { updateCells: "readonly" } },
  },
  {
    // Photosynthesis: shared engine.js draws onto each pathway page's global `ctx`.
    files: ["src/photosynthesis/engine.js"],
    languageOptions: { globals: { ctx: "readonly" } },
  },
  {
    // The pathway scripts consume drawCell/drawMolecule from the shared engine.js.
    files: ["src/photosynthesis/c3.js", "src/photosynthesis/c4.js", "src/photosynthesis/cam.js"],
    languageOptions: { globals: { drawCell: "readonly", drawMolecule: "readonly" } },
  },
];
