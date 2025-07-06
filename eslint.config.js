/**
 * @fileoverview ESLint configuration file.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import eslintConfigESLint from "eslint-config-eslint";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import json from "./src/index.js";
import { defineConfig, globalIgnores } from "eslint/config";

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const eslintPluginJSDoc = eslintConfigESLint.find(
	config => config.plugins?.jsdoc,
).plugins.jsdoc;

const eslintPluginRulesRecommendedConfig =
	eslintPlugin.configs["flat/rules-recommended"];
const eslintPluginTestsRecommendedConfig =
	eslintPlugin.configs["flat/tests-recommended"];

//-----------------------------------------------------------------------------
// Configuration
//-----------------------------------------------------------------------------

export default defineConfig([
	globalIgnores(["**/tests/fixtures/", "**/dist/"]),

	...eslintConfigESLint.map(config => ({
		files: ["**/*.js"],
		...config,
	})),
	{
		plugins: { json },
		files: ["**/*.json"],
		ignores: ["**/package-lock.json"],
		language: "json/json",
		extends: ["json/recommended"],
	},
	{
		files: ["**/*.js"],
		rules: {
			// disable rules we don't want to use from eslint-config-eslint
			"no-undefined": "off",

			// TODO: re-enable eslint-plugin-jsdoc rules
			...Object.fromEntries(
				Object.keys(eslintPluginJSDoc.rules).map(name => [
					`jsdoc/${name}`,
					"off",
				]),
			),
		},
	},
	{
		files: ["**/tests/**"],
		languageOptions: {
			globals: {
				describe: "readonly",
				xdescribe: "readonly",
				it: "readonly",
				xit: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
				before: "readonly",
				after: "readonly",
			},
		},
	},
	{
		files: ["src/rules/*.js"],
		extends: [eslintPluginRulesRecommendedConfig],
		rules: {
			"eslint-plugin/require-meta-schema": "off", // `schema` defaults to []
			"eslint-plugin/prefer-placeholders": "error",
			"eslint-plugin/prefer-replace-text": "error",
			"eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
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
		files: ["tools/**/*.js"],
		rules: {
			"no-console": "off",
		},
	},
]);
