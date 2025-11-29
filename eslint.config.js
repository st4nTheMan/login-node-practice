const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["node_modules/", "public/css/output.css"],
  },

  // Backend (Node) files
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "off", // Node globals allowed
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-console": "off", // allow console.log
    },
  },

  // Frontend (Browser) files
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        alert: "readonly",
        location: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "off",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-console": "off",
    },
  },
];
