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
			assert.strictEqual(sourceCode.ast, ast);
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

			assert.strictEqual(sourceCode.getLoc(ast), loc);
		});
	});

	describe("getLocFromIndex()", () => {
		it("should convert index to location correctly", () => {
			const file = { body: '{\n  "a": "b"\r\n}', path: "test.json" };
			const language = new JSONLanguage({ mode: "json" });
			const parseResult = language.parse(file);
			const sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});

			assert.deepStrictEqual(sourceCode.getLocFromIndex(0), {
				line: 1,
				column: 1,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(1), {
				line: 1,
				column: 2,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(2), {
				line: 2,
				column: 1,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(3), {
				line: 2,
				column: 2,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(4), {
				line: 2,
				column: 3,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(5), {
				line: 2,
				column: 4,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(6), {
				line: 2,
				column: 5,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(7), {
				line: 2,
				column: 6,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(8), {
				line: 2,
				column: 7,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(9), {
				line: 2,
				column: 8,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(10), {
				line: 2,
				column: 9,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(11), {
				line: 2,
				column: 10,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(12), {
				line: 2,
				column: 11,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(13), {
				line: 2,
				column: 12,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(14), {
				line: 3,
				column: 1,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(15), {
				line: 3,
				column: 2,
			});
		});
	});

	describe("getIndexFromLoc()", () => {
		it("should convert location to index correctly", () => {
			const file = { body: '{\n  "a": "b"\r\n}', path: "test.json" };
			const language = new JSONLanguage({ mode: "json" });
			const parseResult = language.parse(file);
			const sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});

			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 1,
					column: 1,
				}),
				0,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 1,
					column: 2,
				}),
				1,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 1,
				}),
				2,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 2,
				}),
				3,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 3,
				}),
				4,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 4,
				}),
				5,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 5,
				}),
				6,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 6,
				}),
				7,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 7,
				}),
				8,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 8,
				}),
				9,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 9,
				}),
				10,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 10,
				}),
				11,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 11,
				}),
				12,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 2,
					column: 12,
				}),
				13,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 3,
					column: 1,
				}),
				14,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({
					line: 3,
					column: 2,
				}),
				15,
			);
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

			assert.strictEqual(sourceCode.getRange(ast), range);
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
		it("should split lines on LF line endings", () => {
			const file = { body: "{\n//test\n}", path: "test.jsonc" };
			const language = new JSONLanguage({ mode: "jsonc" });
			const parseResult = language.parse(file);
			const sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});

			assert.deepStrictEqual(sourceCode.lines, ["{", "//test", "}"]);
		});

		it("should split lines on CR line endings", () => {
			const file = { body: "{\r//test\r}", path: "test.jsonc" };
			const language = new JSONLanguage({ mode: "jsonc" });
			const parseResult = language.parse(file);
			const sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});

			assert.deepStrictEqual(sourceCode.lines, ["{", "//test", "}"]);
		});

		it("should split lines on CRLF line endings", () => {
			const file = { body: "{\r\n//test\r\n}", path: "test.jsonc" };
			const language = new JSONLanguage({ mode: "jsonc" });
			const parseResult = language.parse(file);
			const sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});

			assert.deepStrictEqual(sourceCode.lines, ["{", "//test", "}"]);
		});

		it("should split lines with mixed line endings (LF, CRLF, CR)", () => {
			const file = {
				body: "{\n//one\r\n//two\r}",
				path: "test.jsonc",
			};
			const language = new JSONLanguage({ mode: "jsonc" });
			const parseResult = language.parse(file);
			const sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});

			assert.deepStrictEqual(sourceCode.lines, [
				"{",
				"//one",
				"//two",
				"}",
			]);
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

			assert.strictEqual(sourceCode.getParent(node), ast);
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

			assert.strictEqual(sourceCode.getParent(node), ast.body.members[0]);
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
							assert.strictEqual(
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
						assert.strictEqual(problems[0].loc, allComments[6].loc);
						assert.strictEqual(problems[1].ruleId, null);
						assert.match(problems[1].message, /Failed to parse/u);
						assert.strictEqual(problems[1].loc, allComments[7].loc);
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
						assert.strictEqual(
							problems[0].loc,
							allComments[21].loc,
						);
					});
				});
			});
		});
	});

	describe("getTokenBefore()", () => {
		let sourceCode;
		let file;
		let language;
		let parseResult;

		beforeEach(() => {
			file = { body: '{ "a": 1 }', path: "test.json" };
			language = new JSONLanguage({ mode: "json" });
			parseResult = language.parse(file);
			sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});
		});

		it("should return null for the first token (no options)", () => {
			const firstToken = sourceCode.ast.tokens[0];
			assert.strictEqual(sourceCode.getTokenBefore(firstToken), null);
		});

		it("should return null for the first token (includeComments)", () => {
			const firstToken = sourceCode.ast.tokens[0];
			assert.strictEqual(
				sourceCode.getTokenBefore(firstToken, {
					includeComments: true,
				}),
				null,
			);
		});

		it("should return the previous token for a middle token (no options)", () => {
			const tokens = sourceCode.ast.tokens;
			const secondToken = tokens[1];

			assert.strictEqual(
				sourceCode.getTokenBefore(secondToken),
				tokens[0],
			);
		});

		it("should return the previous token for a middle token (includeComments)", () => {
			const tokens = sourceCode.ast.tokens;
			const secondToken = tokens[1];

			assert.strictEqual(
				sourceCode.getTokenBefore(secondToken, {
					includeComments: true,
				}),
				tokens[0],
			);
		});

		it("should return null when passing a node that does not exist (no options)", () => {
			assert.strictEqual(
				sourceCode.getTokenBefore({ type: "String", range: [20, 25] }),
				null,
			);
		});

		it("should return null when passing a node that does not exist (includeComments)", () => {
			assert.strictEqual(
				sourceCode.getTokenBefore(
					{ type: "String", range: [20, 25] },
					{ includeComments: true },
				),
				null,
			);
		});

		it("should return the previous token when passing a node as the argument (no options)", () => {
			const propertyNode = sourceCode.ast.body.members[0];
			const valueNode = propertyNode.value;
			const valueToken = sourceCode.ast.tokens.find(
				token => token.range[0] === valueNode.range[0],
			);
			const prevToken = sourceCode.getTokenBefore(valueNode);

			assert.strictEqual(
				prevToken,
				sourceCode.ast.tokens[
					sourceCode.ast.tokens.indexOf(valueToken) - 1
				],
			);
		});

		it("should return the previous token when passing a node as the argument (includeComments)", () => {
			const propertyNode = sourceCode.ast.body.members[0];
			const valueNode = propertyNode.value;
			const valueToken = sourceCode.ast.tokens.find(
				token => token.range[0] === valueNode.range[0],
			);
			const prevTokenWithComments = sourceCode.getTokenBefore(valueNode, {
				includeComments: true,
			});

			assert.strictEqual(
				prevTokenWithComments,
				sourceCode.ast.tokens[
					sourceCode.ast.tokens.indexOf(valueToken) - 1
				],
			);
		});

		it("should return the previous comment for a token after a comment (includeComments)", () => {
			const commentFile = {
				body: '{ // comment\n "a": 1 }',
				path: "test.jsonc",
			};
			const commentLanguage = new JSONLanguage({ mode: "jsonc" });
			const commentParseResult = commentLanguage.parse(commentFile);
			const commentSourceCode = new JSONSourceCode({
				text: commentFile.body,
				ast: commentParseResult.ast,
			});

			const tokens = commentSourceCode.ast.tokens;
			const comment = commentSourceCode.comments[0];
			const afterCommentToken = tokens.find(
				t => t.range[0] > comment.range[1],
			);

			assert.strictEqual(
				commentSourceCode.getTokenBefore(afterCommentToken, {
					includeComments: true,
				}),
				comment,
			);
		});

		it("should return null for a node at the start of the file (no options)", () => {
			assert.strictEqual(sourceCode.getTokenBefore(sourceCode.ast), null);
		});

		it("should return null for a node at the start of the file (includeComments)", () => {
			assert.strictEqual(
				sourceCode.getTokenBefore(sourceCode.ast, {
					includeComments: true,
				}),
				null,
			);
		});
	});

	describe("getTokenAfter()", () => {
		let sourceCode;
		let file;
		let language;
		let parseResult;

		beforeEach(() => {
			file = { body: '{"foo": 123, "bar": []}', path: "test.json" };
			language = new JSONLanguage({ mode: "json" });
			parseResult = language.parse(file);
			sourceCode = new JSONSourceCode({
				text: file.body,
				ast: parseResult.ast,
			});
		});

		it("should return the next token after a node (no options)", () => {
			const stringNode = parseResult.ast.body.members[0].name;
			const nextToken = sourceCode.getTokenAfter(stringNode);

			assert.strictEqual(nextToken.type, "Colon");
		});

		it("should return the next token after a node (includeComments)", () => {
			const stringNode = parseResult.ast.body.members[0].name;
			const nextToken = sourceCode.getTokenAfter(stringNode, {
				includeComments: true,
			});

			assert.strictEqual(nextToken.type, "Colon");
		});

		it("should return the next token after a node that is made up of multiple tokens (no options)", () => {
			const objectNode = parseResult.ast.body.members[1].value;
			const nextToken = sourceCode.getTokenAfter(objectNode);

			assert.strictEqual(nextToken.type, "RBrace");
		});

		it("should return the next token after a node that is made up of multiple tokens (includeComments)", () => {
			const objectNode = parseResult.ast.body.members[1].value;
			const nextToken = sourceCode.getTokenAfter(objectNode, {
				includeComments: true,
			});

			assert.strictEqual(nextToken.type, "RBrace");
		});

		it("should return the next token after a token (no options)", () => {
			const openBraceToken = parseResult.ast.tokens.find(
				token => token.type === "LBrace",
			);
			const nextToken = sourceCode.getTokenAfter(openBraceToken);

			assert.strictEqual(nextToken.type, "String");
		});

		it("should return the next token after a token (includeComments)", () => {
			const openBraceToken = parseResult.ast.tokens.find(
				token => token.type === "LBrace",
			);
			const nextToken = sourceCode.getTokenAfter(openBraceToken, {
				includeComments: true,
			});

			assert.strictEqual(nextToken.type, "String");
		});

		it("should skip comments when getting next token (no options)", () => {
			const commentFile = {
				body: '{\n// comment\n"foo": true}',
				path: "test.jsonc",
			};
			const commentLanguage = new JSONLanguage({ mode: "jsonc" });
			const commentParseResult = commentLanguage.parse(commentFile);
			const commentSourceCode = new JSONSourceCode({
				text: commentFile.body,
				ast: commentParseResult.ast,
			});

			const openBraceToken = commentParseResult.ast.tokens.find(
				token => token.type === "LBrace",
			);
			const nextToken = commentSourceCode.getTokenAfter(openBraceToken);

			assert.strictEqual(nextToken.type, "String");
		});

		it("should return the next comment after a token when includeComments is true", () => {
			const commentFile = {
				body: '{ "a": 1 // comment\n}',
				path: "test.jsonc",
			};
			const commentLanguage = new JSONLanguage({ mode: "jsonc" });
			const commentParseResult = commentLanguage.parse(commentFile);
			const commentSourceCode = new JSONSourceCode({
				text: commentFile.body,
				ast: commentParseResult.ast,
			});

			const tokens = commentSourceCode.ast.tokens;
			const valueToken = tokens.find(t => t.type === "Number");
			const nextComment = commentSourceCode.getTokenAfter(valueToken, {
				includeComments: true,
			});
			assert.strictEqual(nextComment.type, "LineComment");
		});

		it("should return the next token after a comment when includeComments is true", () => {
			const commentFile = {
				body: '{ // comment\n "a": 1 }',
				path: "test.jsonc",
			};
			const commentLanguage = new JSONLanguage({ mode: "jsonc" });
			const commentParseResult = commentLanguage.parse(commentFile);
			const commentSourceCode = new JSONSourceCode({
				text: commentFile.body,
				ast: commentParseResult.ast,
			});

			const comment = commentSourceCode.comments[0];
			const nextToken = commentSourceCode.getTokenAfter(comment, {
				includeComments: true,
			});
			assert.strictEqual(nextToken.type, "String");
		});

		it("should return the next comment after a token when passed a node with multiple tokens (includeComments)", () => {
			const commentFile = {
				body: '{"foo": true, "bar": []/* comment */, "baz": 42}',
				path: "test.jsonc",
			};
			const commentLanguage = new JSONLanguage({ mode: "jsonc" });
			const commentParseResult = commentLanguage.parse(commentFile);
			const commentSourceCode = new JSONSourceCode({
				text: commentFile.body,
				ast: commentParseResult.ast,
			});

			const objectNode = commentParseResult.ast.body.members[1].value;
			const nextToken = commentSourceCode.getTokenAfter(objectNode, {
				includeComments: true,
			});
			assert.strictEqual(nextToken.type, "BlockComment");
		});

		it("should return null when there is no next token (no options)", () => {
			const lastToken = parseResult.ast.tokens.at(-1);
			const nextToken = sourceCode.getTokenAfter(lastToken);

			assert.strictEqual(nextToken, null);
		});

		it("should return null when there is no next token (includeComments)", () => {
			const lastToken = parseResult.ast.tokens.at(-1);
			const nextToken = sourceCode.getTokenAfter(lastToken, {
				includeComments: true,
			});

			assert.strictEqual(nextToken, null);
		});

		it("should return null for empty documents (no options)", () => {
			const emptyFile = { body: "{}", path: "test.json" };
			const emptyLanguage = new JSONLanguage({ mode: "json" });
			const emptyParseResult = emptyLanguage.parse(emptyFile);
			const emptySourceCode = new JSONSourceCode({
				text: emptyFile.body,
				ast: emptyParseResult.ast,
			});

			const token = emptyParseResult.ast.tokens.at(-1);
			const nextToken = emptySourceCode.getTokenAfter(token);

			assert.strictEqual(nextToken, null);
		});

		it("should return null for empty documents (includeComments)", () => {
			const emptyFile = { body: "{}", path: "test.json" };
			const emptyLanguage = new JSONLanguage({ mode: "json" });
			const emptyParseResult = emptyLanguage.parse(emptyFile);
			const emptySourceCode = new JSONSourceCode({
				text: emptyFile.body,
				ast: emptyParseResult.ast,
			});

			const token = emptyParseResult.ast.tokens.at(-1);
			const nextToken = emptySourceCode.getTokenAfter(token, {
				includeComments: true,
			});

			assert.strictEqual(nextToken, null);
		});
	});
});
