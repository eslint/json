/**
 * @fileoverview ESLint configuration file.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import eslintConfigESLint from "eslint-config-eslint";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import globals from "globals";
import json from "./src/index.js";
import { defineConfig, globalIgnores } from "eslint/config";

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const eslintPluginRulesRecommendedConfig =
	eslintPlugin.configs["flat/rules-recommended"];
const eslintPluginTestsRecommendedConfig =
	eslintPlugin.configs["flat/tests-recommended"];

//-----------------------------------------------------------------------------
// Configuration
//-----------------------------------------------------------------------------

export default defineConfig([
	globalIgnores(["coverage/", "dist/", "src/build/"], "json/global-ignores"),
	{
		name: "json/js",
		files: ["**/*.js"],
		extends: [eslintConfigESLint],
		rules: {
			"no-undefined": "off",
		},
	},
	{
		name: "json/tools",
		files: ["tools/**/*.js"],
		rules: {
			"no-console": "off",
		},
	},
	{
		name: "json/tests",
		files: ["tests/**/*.js"],
		ignores: ["tests/rules/*.js"],
		languageOptions: {
			globals: {
				...globals.mocha,
			},
		},
	},
	{
		name: "json/rules",
		files: ["src/rules/*.js"],
		extends: [eslintPluginRulesRecommendedConfig],
		rules: {
			"eslint-plugin/require-meta-schema": "off", // `schema` defaults to []
			"eslint-plugin/prefer-placeholders": "error",
			"eslint-plugin/prefer-replace-text": "error",
			"eslint-plugin/report-message-format": ["error", "^[^a-z].*\\.$"],
			"eslint-plugin/require-meta-docs-description": [
				"error",
				{ pattern: "^(Enforce|Require|Disallow) .+[^. ]$" },
			],
			"eslint-plugin/require-meta-docs-url": [
				"error",
				{
					pattern:
						"https://github.com/eslint/json/tree/main/docs/rules/{{name}}.md",
				},
			],
		},
	},
	{
		name: "json/rules-tests",
		files: ["tests/rules/*.test.js"],
		extends: [eslintPluginTestsRecommendedConfig],
		rules: {
			"eslint-plugin/test-case-property-ordering": [
				"error",
				[
					"name",
					"filename",
					"code",
					"output",
					"language",
					"options",
					"languageOptions",
					"errors",
				],
			],
			"eslint-plugin/test-case-shorthand-strings": "error",
		},
	},
	{
		name: "json/json",
		plugins: { json },
		files: ["**/*.json", ".c8rc"],
		language: "json/json",
		extends: ["json/recommended"],
	},
]);
