import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: ["node_modules/**"]
    },
    js.configs.recommended,
    {
        files: ["assets/js/**/*.js", "tests/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node,
                handleInboxSignIn: "readonly"
            }
        },
        rules: {
            "no-console": "off"
        }
    }
];
