/**
 * @fileoverview Integration tests with ESLint.
 * @author Milos Djermanovic
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import json from "../../src/index.js";
import ESLintAPI from "eslint";
const { ESLint } = ESLintAPI;

import assert from "node:assert";
import dedent from "dedent";

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("when the plugin is used with ESLint", () => {
	describe("config comments", () => {
		["jsonc", "json5"].forEach(language => {
			describe(`with ${language} language`, () => {
				const config = {
					files: [`**/*.${language}`],
					plugins: {
						json,
					},
					language: `json/${language}`,
					rules: {
						"json/no-empty-keys": "error",
					},
				};
				const filePath = `test.${language}`;

				let eslint = null;

				beforeEach(() => {
					eslint = new ESLint({
						overrideConfigFile: true,
						overrideConfig: config,
					});
				});

				afterEach(() => {
					eslint = null;
				});

				describe("rule configuration comments", () => {
					it("should be able to turn off rule", async () => {
						const [result] = await eslint.lintText(
							dedent`
								/* eslint json/no-empty-keys: off */
								{
									"": 42
								}
							`,
							{
								filePath,
							},
						);

						assert.strictEqual(result.messages.length, 0);
						assert.strictEqual(result.suppressedMessages.length, 0);
					});

					it("should be able to enable rule", async () => {
						const [result] = await eslint.lintText(
							dedent`
								/* eslint json/no-duplicate-keys: error */
								{
									"foo": 42,
									"foo": 43
								}
							`,
							{
								filePath,
							},
						);

						assert.strictEqual(result.messages.length, 1);

						assert.strictEqual(
							result.messages[0].ruleId,
							"json/no-duplicate-keys",
						);
						assert.strictEqual(
							result.messages[0].messageId,
							"duplicateKey",
						);
						assert.strictEqual(result.messages[0].severity, 2);
						assert.strictEqual(result.messages[0].line, 4);

						assert.strictEqual(result.suppressedMessages.length, 0);
					});

					it("should be able to enable/reconfigure multiple rules", async () => {
						const [result] = await eslint.lintText(
							dedent`
								/* eslint json/no-duplicate-keys: [2], json/no-empty-keys: [1] */
								{
									"": 42,
									"foo": 43,
									"foo": 44
								}
							`,
							{
								filePath,
							},
						);

						assert.strictEqual(result.messages.length, 2);

						assert.strictEqual(
							result.messages[0].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.messages[0].messageId,
							"emptyKey",
						);
						assert.strictEqual(result.messages[0].severity, 1);
						assert.strictEqual(result.messages[0].line, 3);

						assert.strictEqual(
							result.messages[1].ruleId,
							"json/no-duplicate-keys",
						);
						assert.strictEqual(
							result.messages[1].messageId,
							"duplicateKey",
						);
						assert.strictEqual(result.messages[1].severity, 2);
						assert.strictEqual(result.messages[1].line, 5);

						assert.strictEqual(result.suppressedMessages.length, 0);
					});

					it("should be reported when invalid", async () => {
						const [result] = await eslint.lintText(
							dedent`
								// foo
								/* eslint json/no-duplicate-keys: [2 */
								{
								}
							`,
							{
								filePath,
							},
						);

						assert.strictEqual(result.messages.length, 1);

						assert.strictEqual(result.messages[0].ruleId, null);
						assert.match(
							result.messages[0].message,
							/Failed to parse/u,
						);
						assert.strictEqual(result.messages[0].severity, 2);
						assert.strictEqual(result.messages[0].line, 2);
						assert.strictEqual(result.messages[0].column, 1);
						assert.strictEqual(result.messages[0].endLine, 2);
						assert.strictEqual(result.messages[0].endColumn, 40);

						assert.strictEqual(result.suppressedMessages.length, 0);
					});
				});
			});
		});
	});
});
