const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["node_modules/**", "public/css/output.css"],
  },

  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script", // or "module" if needed
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
      "no-undef": "off",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-console": "off",
    },
  },

  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
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
