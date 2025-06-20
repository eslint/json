/**
 * @fileoverview Tests for JSONSourceCode
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { JSONSourceCode } from "../../src/languages/json-source-code.js";
import { JSONLanguage } from "../../src/languages/json-language.js";
import assert from "node:assert";
import dedent from "dedent";

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("JSONSourceCode", () => {
	describe("constructor", () => {
		it("should create a JSONSourceCode instance", () => {
			const ast = {
				type: "Document",
				body: {
					type: "Object",
					properties: [],
				},
				tokens: [],
			};
			const text = "{}";
			const sourceCode = new JSONSourceCode({
				text,
				ast,
			});

			assert.strictEqual(sourceCode.constructor.name, "JSONSourceCode");
			assert.deepStrictEqual(sourceCode.ast, ast);
			assert.strictEqual(sourceCode.text, text);
		});
	});

	describe("getText()", () => {
		it("should return the text of the source code", () => {
			const file = { body: "{}", path: "test.json" };
			const language = new JSONLanguage({ mode: "json" });
			const parseResult = language.parse(file);
			const sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});

			assert.strictEqual(sourceCode.getText(), file.body);
		});
	});

	describe("getLoc()", () => {
		it("should return the loc property of a node", () => {
			const loc = {
				start: {
					line: 1,
					column: 1,
					offset: 0,
				},
				end: {
					line: 1,
					column: 2,
					offset: 1,
				},
			};
			const ast = {
				type: "Document",
				body: {
					type: "Object",
					properties: [],
				},
				tokens: [],
				loc,
			};
			const text = "{}";
			const sourceCode = new JSONSourceCode({
				text,
				ast,
			});

			assert.deepStrictEqual(sourceCode.getLoc(ast), loc);
		});
	});

	describe("getRange()", () => {
		it("should return the range property of a node", () => {
			const range = [0, 1];
			const ast = {
				type: "Document",
				body: {
					type: "Object",
					properties: [],
				},
				tokens: [],
				range,
			};
			const text = "{}";
			const sourceCode = new JSONSourceCode({
				text,
				ast,
			});

			assert.deepStrictEqual(sourceCode.getRange(ast), range);
		});
	});

	describe("comments", () => {
		it("should contain an empty array when parsing JSON", () => {
			const file = { body: "{}", path: "test.json" };
			const language = new JSONLanguage({ mode: "json" });
			const parseResult = language.parse(file);
			const sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});

			assert.deepStrictEqual(sourceCode.comments, []);
		});

		it("should contain an array of comments when parsing JSONC", () => {
			const file = { body: "{\n//test\n}", path: "test.jsonc" };
			const language = new JSONLanguage({ mode: "jsonc" });
			const parseResult = language.parse(file);
			const sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});

			// should contain one comment
			assert.strictEqual(sourceCode.comments.length, 1);

			const comment = sourceCode.comments[0];
			assert.strictEqual(comment.type, "LineComment");
			assert.deepStrictEqual(comment.range, [2, 8]);
			assert.deepStrictEqual(comment.loc, {
				start: { line: 2, column: 1, offset: 2 },
				end: { line: 2, column: 7, offset: 8 },
			});
		});
	});

	describe("lines", () => {
		it("should return an array of lines", () => {
			const file = { body: "{\n//test\n}", path: "test.jsonc" };
			const language = new JSONLanguage({ mode: "jsonc" });
			const parseResult = language.parse(file);
			const sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});

			assert.deepStrictEqual(sourceCode.lines, ["{", "//test", "}"]);
		});
	});

	describe("getParent()", () => {
		it("should return the parent node for a given node", () => {
			const ast = {
				type: "Document",
				body: {
					type: "Object",
					properties: [],
				},
				tokens: [],
			};
			const text = "{}";
			const sourceCode = new JSONSourceCode({
				text,
				ast,
			});
			const node = ast.body;

			// call traverse to initialize the parent map
			sourceCode.traverse();

			assert.deepStrictEqual(sourceCode.getParent(node), ast);
		});

		it("should return the parent node for a deeply nested node", () => {
			const ast = {
				type: "Document",
				body: {
					type: "Object",
					members: [
						{
							type: "Member",
							name: {
								type: "Identifier",
								name: "foo",
							},
							value: {
								type: "Object",
								properties: [],
							},
						},
					],
				},
				tokens: [],
			};
			const text = '{"foo":{}}';
			const sourceCode = new JSONSourceCode({
				text,
				ast,
			});
			const node = ast.body.members[0].value;

			// call traverse to initialize the parent map
			sourceCode.traverse();

			assert.deepStrictEqual(
				sourceCode.getParent(node),
				ast.body.members[0],
			);
		});
	});

	describe("getAncestors()", () => {
		it("should return an array of ancestors for a given node", () => {
			const ast = {
				type: "Document",
				body: {
					type: "Object",
					members: [],
				},
				tokens: [],
			};
			const text = "{}";
			const sourceCode = new JSONSourceCode({
				text,
				ast,
			});
			const node = ast.body;

			// call traverse to initialize the parent map
			sourceCode.traverse();

			assert.deepStrictEqual(sourceCode.getAncestors(node), [ast]);
		});

		it("should return an array of ancestors for a deeply nested node", () => {
			const ast = {
				type: "Document",
				body: {
					type: "Object",
					members: [
						{
							type: "Member",
							name: {
								type: "Identifier",
								name: "foo",
							},
							value: {
								type: "Object",
								members: [],
							},
						},
					],
				},
				tokens: [],
			};
			const text = '{"foo":{}}';
			const sourceCode = new JSONSourceCode({
				text,
				ast,
			});
			const node = ast.body.members[0].value;

			// call traverse to initialize the parent map
			sourceCode.traverse();

			assert.deepStrictEqual(sourceCode.getAncestors(node), [
				ast,
				ast.body,
				ast.body.members[0],
			]);
		});
	});

	describe("config comments", () => {
		const text = dedent`
			{
				/* rule config comments */
				//eslint json/no-duplicate-keys: error
				// eslint json/no-duplicate-keys: [1] -- comment
				/*eslint json/no-duplicate-keys: [2, { allow: ["foo"] }]*/
				/*
					eslint
						json/no-empty-keys: warn,
						json/no-duplicate-keys: [2, "strict"]
					--
					comment
				*/

				// invalid rule config comments
				// eslint json/no-duplicate-keys: [error
				/*eslint json/no-duplicate-keys: [1, { allow: ["foo"] ]*/

				// not rule config comments
				//eslintjson/no-duplicate-keys: error
				/*-eslint json/no-duplicate-keys: error*/

				/* disable directives */
				//eslint-disable
				/* eslint-disable json/no-duplicate-keys -- we want duplicate keys */
				// eslint-enable json/no-duplicate-keys, json/no-empty-keys
				/*eslint-enable*/
				"": 5, // eslint-disable-line json/no-empty-keys
				/*eslint-disable-line json/no-empty-keys -- special case*/ "": 6,
				//eslint-disable-next-line
				"": 7,
				/* eslint-disable-next-line json/no-duplicate-keys, json/no-empty-keys
				   -- another special case
				*/
				"": 8

				// invalid disable directives
				/* eslint-disable-line json/no-duplicate-keys
				*/

				// not disable directives
				///eslint-disable
				/*eslint-disable-*/
			}
		`;

		["jsonc", "json5"].forEach(languageMode => {
			describe(`with ${languageMode} language`, () => {
				let sourceCode = null;

				beforeEach(() => {
					const file = { body: text, path: `test.${languageMode}` };
					const language = new JSONLanguage({ mode: languageMode });
					const parseResult = language.parse(file);
					sourceCode = new JSONSourceCode({
						text: file.body,
						ast: parseResult.ast,
					});
				});

				afterEach(() => {
					sourceCode = null;
				});

				describe("getInlineConfigNodes()", () => {
					it("should return inline config comments", () => {
						const allComments = sourceCode.comments;
						const configComments =
							sourceCode.getInlineConfigNodes();

						const configCommentsIndexes = [
							1, 2, 3, 4, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19,
							21,
						];

						assert.strictEqual(
							configComments.length,
							configCommentsIndexes.length,
						);

						configComments.forEach((configComment, i) => {
							assert.deepStrictEqual(
								configComment,
								allComments[configCommentsIndexes[i]],
							);
						});
					});
				});

				describe("applyInlineConfig()", () => {
					it("should return rule configs and problems", () => {
						const allComments = sourceCode.comments;
						const { configs, problems } =
							sourceCode.applyInlineConfig();

						assert.deepStrictEqual(configs, [
							{
								config: {
									rules: {
										"json/no-duplicate-keys": "error",
									},
								},
								loc: allComments[1].loc,
							},
							{
								config: {
									rules: {
										"json/no-duplicate-keys": [1],
									},
								},
								loc: allComments[2].loc,
							},
							{
								config: {
									rules: {
										"json/no-duplicate-keys": [
											2,
											{ allow: ["foo"] },
										],
									},
								},
								loc: allComments[3].loc,
							},
							{
								config: {
									rules: {
										"json/no-empty-keys": "warn",
										"json/no-duplicate-keys": [2, "strict"],
									},
								},
								loc: allComments[4].loc,
							},
						]);

						assert.strictEqual(problems.length, 2);
						assert.strictEqual(problems[0].ruleId, null);
						assert.match(problems[0].message, /Failed to parse/u);
						assert.deepStrictEqual(
							problems[0].loc,
							allComments[6].loc,
						);
						assert.strictEqual(problems[1].ruleId, null);
						assert.match(problems[1].message, /Failed to parse/u);
						assert.deepStrictEqual(
							problems[1].loc,
							allComments[7].loc,
						);
					});
				});

				describe("getDisableDirectives()", () => {
					it("should return disable directives and problems", () => {
						const allComments = sourceCode.comments;
						const { directives, problems } =
							sourceCode.getDisableDirectives();

						assert.deepStrictEqual(
							directives.map(obj => ({ ...obj })),
							[
								{
									type: "disable",
									value: "",
									justification: "",
									node: allComments[12],
								},
								{
									type: "disable",
									value: "json/no-duplicate-keys",
									justification: "we want duplicate keys",
									node: allComments[13],
								},
								{
									type: "enable",
									value: "json/no-duplicate-keys, json/no-empty-keys",
									justification: "",
									node: allComments[14],
								},
								{
									type: "enable",
									value: "",
									justification: "",
									node: allComments[15],
								},
								{
									type: "disable-line",
									value: "json/no-empty-keys",
									justification: "",
									node: allComments[16],
								},
								{
									type: "disable-line",
									value: "json/no-empty-keys",
									justification: "special case",
									node: allComments[17],
								},
								{
									type: "disable-next-line",
									value: "",
									justification: "",
									node: allComments[18],
								},
								{
									type: "disable-next-line",
									value: "json/no-duplicate-keys, json/no-empty-keys",
									justification: "another special case",
									node: allComments[19],
								},
							],
						);

						assert.strictEqual(problems.length, 1);
						assert.strictEqual(problems[0].ruleId, null);
						assert.strictEqual(
							problems[0].message,
							"eslint-disable-line comment should not span multiple lines.",
						);
						assert.deepStrictEqual(
							problems[0].loc,
							allComments[21].loc,
						);
					});
				});
			});
		});
	});
});
