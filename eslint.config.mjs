import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            regex: "@discordjs/core$",
                            message:
                                "Please import from @discordjs/core/http-only instead",
                        },
                    ],
                },
            ],
        },
        languageOptions: { globals: globals.node },
    },
    tseslint.configs.recommended,
]);
