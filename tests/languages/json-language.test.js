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

	describe("validateLanguageOptions()", () => {
		it("should throw an error when allowTrailingCommas is not a boolean", () => {
			const language = new JSONLanguage({
				mode: "jsonc",
				allowTrailingCommas: "true",
			});
			assert.throws(() => {
				language.validateLanguageOptions({
					allowTrailingCommas: "true",
				});
			}, /allowTrailingCommas/u);
		});

		it("should throw an error when allowTrailingCommas is a boolean in JSON mode", () => {
			const language = new JSONLanguage({ mode: "json" });
			assert.throws(() => {
				language.validateLanguageOptions({ allowTrailingCommas: true });
			}, /allowTrailingCommas/u);
		});

		it("should throw an error when allowTrailingCommas is a boolean in JSON5 mode", () => {
			const language = new JSONLanguage({ mode: "json5" });
			assert.throws(() => {
				language.validateLanguageOptions({ allowTrailingCommas: true });
			}, /allowTrailingCommas/u);
		});

		it("should not throw an error when allowTrailingCommas is a boolean in JSONC mode", () => {
			const language = new JSONLanguage({ mode: "jsonc" });
			assert.doesNotThrow(() => {
				language.validateLanguageOptions({ allowTrailingCommas: true });
			});
		});

		it("should not throw an error when allowTrailingCommas is not provided", () => {
			const language = new JSONLanguage({ mode: "jsonc" });
			assert.doesNotThrow(() => {
				language.validateLanguageOptions({});
			});
		});

		it("should not throw an error when allowTrailingCommas is not provided and other keys are present", () => {
			const language = new JSONLanguage({ mode: "jsonc" });
			assert.doesNotThrow(() => {
				language.validateLanguageOptions({ foo: "bar" });
			});
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

		it("should not parse trailing commas by default in json mode", () => {
			const language = new JSONLanguage({ mode: "json" });
			const result = language.parse({
				body: '{\n"a": 1,\n}',
				path: "test.json",
			});

			assert.strictEqual(result.ok, false);
			assert.strictEqual(
				result.errors[0].message,
				"Unexpected token RBrace found.",
			);
		});

		it("should not parse trailing commas by default in jsonc mode", () => {
			const language = new JSONLanguage({ mode: "jsonc" });
			const result = language.parse({
				body: '{\n"a": 1,\n}',
				path: "test.jsonc",
			});

			assert.strictEqual(result.ok, false);
			assert.strictEqual(
				result.errors[0].message,
				"Unexpected token RBrace found.",
			);
		});

		it("should parse trailing commas when enabled in jsonc mode", () => {
			const language = new JSONLanguage({ mode: "jsonc" });
			const result = language.parse(
				{
					body: '{\n"a": 1,\n}',
					path: "test.jsonc",
				},
				{ languageOptions: { allowTrailingCommas: true } },
			);

			assert.strictEqual(result.ok, true);
			assert.strictEqual(result.ast.type, "Document");
			assert.strictEqual(result.ast.body.type, "Object");
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

		it("should parse jsonc when `mode` is 'jsonc'", () => {
			const language = new JSONLanguage({ mode: "jsonc" });
			const result = language.parse({
				body: "{\n//test\n}",
				path: "test.jsonc",
			});

			assert.strictEqual(result.ok, true);
			assert.strictEqual(result.ast.type, "Document");
			assert.strictEqual(result.ast.body.type, "Object");
		});

		it("should parse json5 when `mode` is 'json5'", () => {
			const language = new JSONLanguage({ mode: "json5" });
			const result = language.parse({
				body: '{\nfoo: "bar"\n}',
				path: "test.json5",
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

		it("should create a JSONSourceCode instance for JSON5", () => {
			const language = new JSONLanguage({ mode: "json5" });
			const file = { body: '{\nfoo: "bar"\n}', path: "test.json5" };
			const parseResult = language.parse(file);
			const sourceCode = language.createSourceCode(
				file,
				parseResult,
				"test.json5",
			);

			assert.strictEqual(sourceCode.constructor.name, "JSONSourceCode");
			assert.strictEqual(sourceCode.ast.type, "Document");
			assert.strictEqual(sourceCode.ast.body.type, "Object");
			assert.strictEqual(sourceCode.text, '{\nfoo: "bar"\n}');
			assert.strictEqual(sourceCode.comments.length, 0);
		});
	});
});
