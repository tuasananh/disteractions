import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        ignores: ["eslint.config.mjs"],
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
            "@typescript-eslint/strict-boolean-expressions": "error",
        },
        languageOptions: { globals: globals.node },
    },
    tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
]);
