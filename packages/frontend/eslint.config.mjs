import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { fixupConfigRules } from "@eslint/compat";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    }
  },

  ...tseslint.configs.recommended,

  ...fixupConfigRules(pluginReact.configs.recommended),

  {
    rules: {
      "no-unused-vars": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    }
  },

];