import js from "@eslint/js";
import tsdoc from "eslint-plugin-tsdoc";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js, tsdoc },
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
            "tsdoc/syntax": "error",
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
    globalIgnores(["eslint.config.mjs"]),
]);
