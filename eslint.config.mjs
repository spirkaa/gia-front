import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

const files = ["**/*.{js,jsx,mjs,cjs}"]

export default [
  { ignores: ["build/", "node_modules/"] },
  { files, ...js.configs.recommended },
  { files, ...react.configs.flat.recommended },
  { files, ...react.configs.flat["jsx-runtime"] },
  { files, ...reactHooks.configs.flat.recommended },
  {
    files,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-unused-vars": [
        "error",
        { vars: "all", args: "none", ignoreRestSiblings: true },
      ],
      "react/prop-types": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  { files, ...prettier },
]
