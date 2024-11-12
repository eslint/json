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
	describe("plugin configs", () => {
		Object.keys(json.configs).forEach(configName => {
			it(`Using "${configName}" config should not throw`, async () => {
				const config = {
					files: ["**/*.json"],
					language: "json/json",
					...json.configs[configName],
				};

				const eslint = new ESLint({
					overrideConfigFile: true,
					overrideConfig: config,
				});

				await eslint.lintText("{}", { filePath: "test.json" });
			});
		});
	});

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

				describe("disable directives", () => {
					it("eslint-disable should suppress rule errors, eslint-enable should re-enable rule errors", async () => {
						const [result] = await eslint.lintText(
							dedent`
								[
									/* eslint-disable json/no-empty-keys -- allowed in first two elements */	
									{
										"": 42
									},
									{
										"": 43
									},
									/* eslint-enable json/no-empty-keys */
									{
										"": 44
									}
								]
							`,
							{
								filePath,
							},
						);

						assert.strictEqual(result.messages.length, 1);

						assert.strictEqual(
							result.messages[0].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.messages[0].messageId,
							"emptyKey",
						);
						assert.strictEqual(result.messages[0].severity, 2);
						assert.strictEqual(result.messages[0].line, 11);

						assert.strictEqual(result.suppressedMessages.length, 2);

						assert.strictEqual(
							result.suppressedMessages[0].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.suppressedMessages[0].messageId,
							"emptyKey",
						);
						assert.strictEqual(
							result.suppressedMessages[0].severity,
							2,
						);
						assert.strictEqual(
							result.suppressedMessages[0].line,
							4,
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions.length,
							1,
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions[0].kind,
							"directive",
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions[0]
								.justification,
							"allowed in first two elements",
						);

						assert.strictEqual(
							result.suppressedMessages[1].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.suppressedMessages[1].messageId,
							"emptyKey",
						);
						assert.strictEqual(
							result.suppressedMessages[1].severity,
							2,
						);
						assert.strictEqual(
							result.suppressedMessages[1].line,
							7,
						);
						assert.strictEqual(
							result.suppressedMessages[1].suppressions.length,
							1,
						);
						assert.strictEqual(
							result.suppressedMessages[1].suppressions[0].kind,
							"directive",
						);
						assert.strictEqual(
							result.suppressedMessages[1].suppressions[0]
								.justification,
							"allowed in first two elements",
						);
					});

					it("eslint-disable should suppress errors from multiple rules", async () => {
						const [result] = await eslint.lintText(
							dedent`
								/* eslint json/no-duplicate-keys: warn */
								/* eslint-disable json/no-empty-keys, json/no-duplicate-keys */	
								{
									"": 42,
									"foo": 5,
									"foo": 6
								}
							`,
							{
								filePath,
							},
						);

						assert.strictEqual(result.suppressedMessages.length, 2);

						assert.strictEqual(
							result.suppressedMessages[0].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.suppressedMessages[0].messageId,
							"emptyKey",
						);
						assert.strictEqual(
							result.suppressedMessages[0].severity,
							2,
						);
						assert.strictEqual(
							result.suppressedMessages[0].line,
							4,
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions.length,
							1,
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions[0].kind,
							"directive",
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions[0]
								.justification,
							"",
						);

						assert.strictEqual(
							result.suppressedMessages[1].ruleId,
							"json/no-duplicate-keys",
						);
						assert.strictEqual(
							result.suppressedMessages[1].messageId,
							"duplicateKey",
						);
						assert.strictEqual(
							result.suppressedMessages[1].severity,
							1,
						);
						assert.strictEqual(
							result.suppressedMessages[1].line,
							6,
						);
						assert.strictEqual(
							result.suppressedMessages[1].suppressions.length,
							1,
						);
						assert.strictEqual(
							result.suppressedMessages[1].suppressions[0].kind,
							"directive",
						);
						assert.strictEqual(
							result.suppressedMessages[1].suppressions[0]
								.justification,
							"",
						);
					});

					it("eslint-disable-line should suppress rule errors on the same line", async () => {
						const [result] = await eslint.lintText(
							dedent`
								{
									"": 42, // eslint-disable-line json/no-empty-keys -- allowed here
									"": 43
								}
							`,
							{
								filePath,
							},
						);

						assert.strictEqual(result.messages.length, 1);

						assert.strictEqual(
							result.messages[0].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.messages[0].messageId,
							"emptyKey",
						);
						assert.strictEqual(result.messages[0].severity, 2);
						assert.strictEqual(result.messages[0].line, 3);

						assert.strictEqual(result.suppressedMessages.length, 1);

						assert.strictEqual(
							result.suppressedMessages[0].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.suppressedMessages[0].messageId,
							"emptyKey",
						);
						assert.strictEqual(
							result.suppressedMessages[0].severity,
							2,
						);
						assert.strictEqual(
							result.suppressedMessages[0].line,
							2,
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions.length,
							1,
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions[0].kind,
							"directive",
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions[0]
								.justification,
							"allowed here",
						);
					});

					it("eslint-disable-next-line should suppress rule errors on the next line", async () => {
						const [result] = await eslint.lintText(
							dedent`
								{
									"": 42, // eslint-disable-next-line json/no-empty-keys -- allowed here
									"": 43
								}
							`,
							{
								filePath,
							},
						);

						assert.strictEqual(result.messages.length, 1);

						assert.strictEqual(
							result.messages[0].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.messages[0].messageId,
							"emptyKey",
						);
						assert.strictEqual(result.messages[0].severity, 2);
						assert.strictEqual(result.messages[0].line, 2);

						assert.strictEqual(result.suppressedMessages.length, 1);

						assert.strictEqual(
							result.suppressedMessages[0].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.suppressedMessages[0].messageId,
							"emptyKey",
						);
						assert.strictEqual(
							result.suppressedMessages[0].severity,
							2,
						);
						assert.strictEqual(
							result.suppressedMessages[0].line,
							3,
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions.length,
							1,
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions[0].kind,
							"directive",
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions[0]
								.justification,
							"allowed here",
						);
					});

					it("multiline eslint-disable-next-line should suppress rule errors on the next line", async () => {
						const [result] = await eslint.lintText(
							dedent`
								{
									/*  eslint-disable-next-line
										json/no-empty-keys
									*/	
									"": 42
								}
							`,
							{
								filePath,
							},
						);

						assert.strictEqual(result.messages.length, 0);

						assert.strictEqual(result.suppressedMessages.length, 1);

						assert.strictEqual(
							result.suppressedMessages[0].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.suppressedMessages[0].messageId,
							"emptyKey",
						);
						assert.strictEqual(
							result.suppressedMessages[0].severity,
							2,
						);
						assert.strictEqual(
							result.suppressedMessages[0].line,
							5,
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions.length,
							1,
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions[0].kind,
							"directive",
						);
						assert.strictEqual(
							result.suppressedMessages[0].suppressions[0]
								.justification,
							"",
						);
					});

					it("multiline eslint-disable-line should be reported as error and not suppress any rule errors", async () => {
						const [result] = await eslint.lintText(
							dedent`
								{
									"": 42, /*  eslint-disable-line
										json/no-empty-keys
										*/ "": 43
								}
							`,
							{
								filePath,
							},
						);

						assert.strictEqual(result.messages.length, 3);

						assert.strictEqual(
							result.messages[0].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.messages[0].messageId,
							"emptyKey",
						);
						assert.strictEqual(result.messages[0].severity, 2);
						assert.strictEqual(result.messages[0].line, 2);

						assert.strictEqual(result.messages[1].ruleId, null);
						assert.strictEqual(
							result.messages[1].message,
							"eslint-disable-line comment should not span multiple lines.",
						);
						assert.strictEqual(result.messages[1].severity, 2);
						assert.strictEqual(result.messages[1].line, 2);
						assert.strictEqual(result.messages[1].column, 10);
						assert.strictEqual(result.messages[1].endLine, 4);
						assert.strictEqual(result.messages[1].endColumn, 5);

						assert.strictEqual(
							result.messages[2].ruleId,
							"json/no-empty-keys",
						);
						assert.strictEqual(
							result.messages[2].messageId,
							"emptyKey",
						);
						assert.strictEqual(result.messages[2].severity, 2);
						assert.strictEqual(result.messages[2].line, 4);

						assert.strictEqual(result.suppressedMessages.length, 0);
					});
				});
			});
		});
	});
});
