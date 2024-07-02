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

	describe("get lines", () => {
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
});
