/**
 * @fileoverview Tests for JSONLanguage
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { JSONLanguage } from "../../src/languages/json-language.js";
import assert from "node:assert";

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("JSONLanguage", () => {
	describe("visitorKeys", () => {
		it("should have visitorKeys property", () => {
			const language = new JSONLanguage({ mode: "json" });

			assert.deepStrictEqual(language.visitorKeys.Document, ["body"]);
		});
	});

	describe("parse()", () => {
		it("should not parse jsonc by default", () => {
			const language = new JSONLanguage({ mode: "json" });
			const result = language.parse({
				body: "{\n//test\n}",
				path: "test.json",
			});

			assert.strictEqual(result.ok, false);
			assert.strictEqual(
				result.errors[0].message,
				"Unexpected character '/' found.",
			);
		});

		it("should parse json by default", () => {
			const language = new JSONLanguage({ mode: "json" });
			const result = language.parse({
				body: "{\n\n}",
				path: "test.json",
			});

			assert.strictEqual(result.ok, true);
			assert.strictEqual(result.ast.type, "Document");
			assert.strictEqual(result.ast.body.type, "Object");
		});

		it("should set the mode to jsonc", () => {
			const language = new JSONLanguage({ mode: "jsonc" });
			const result = language.parse({
				body: "{\n//test\n}",
				path: "test.jsonc",
			});

			assert.strictEqual(result.ok, true);
			assert.strictEqual(result.ast.type, "Document");
			assert.strictEqual(result.ast.body.type, "Object");
		});
	});

	describe("createSourceCode()", () => {
		it("should create a JSONSourceCode instance for JSON", () => {
			const language = new JSONLanguage({ mode: "json" });
			const file = { body: "{\n\n}", path: "test.json" };
			const parseResult = language.parse(file);
			const sourceCode = language.createSourceCode(file, parseResult);
			assert.strictEqual(sourceCode.constructor.name, "JSONSourceCode");

			assert.strictEqual(sourceCode.ast.type, "Document");
			assert.strictEqual(sourceCode.ast.body.type, "Object");
			assert.strictEqual(sourceCode.text, "{\n\n}");
			assert.strictEqual(sourceCode.comments.length, 0);
		});

		it("should create a JSONSourceCode instance for JSONC", () => {
			const language = new JSONLanguage({ mode: "jsonc" });
			const file = { body: "{\n//test\n}", path: "test.jsonc" };
			const parseResult = language.parse(file);
			const sourceCode = language.createSourceCode(
				file,
				parseResult,
				"test.jsonc",
			);

			assert.strictEqual(sourceCode.constructor.name, "JSONSourceCode");

			assert.strictEqual(sourceCode.ast.type, "Document");
			assert.strictEqual(sourceCode.ast.body.type, "Object");
			assert.strictEqual(sourceCode.text, "{\n//test\n}");
			assert.strictEqual(sourceCode.comments.length, 1);
		});
	});
});
