/**
 * @fileoverview Tests for util.js
 * @author 루밀LuMir(lumirlumir)
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import assert from "node:assert";
import { JSONLanguage } from "../src/languages/json-language.js";
import { JSONSourceCode } from "../src/languages/json-source-code.js";
import { getKey, getRawKey } from "../src/util.js";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("util", () => {
	describe("getKey()", () => {
		it("should return the correct key for `String` nodes", () => {
			const node = {
				name: { type: "String", value: "value" },
			};

			assert.strictEqual(getKey(node), "value");
		});

		it("should return the correct key for `Identifier` nodes", () => {
			const node = {
				name: { type: "Identifier", name: "name" },
			};

			assert.strictEqual(getKey(node), "name");
		});
	});

	describe("getRawKey()", () => {
		const file = { body: `{"foo": 1, 'bar': 2, baz: 3}` };
		const language = new JSONLanguage({ mode: "json5" });
		const parseResult = language.parse(file);
		const sourceCode = new JSONSourceCode({
			text: file.body,
			ast: parseResult.ast,
		});

		it("should return correct raw key for `String` nodes with double quotes", () => {
			const fooNode = parseResult.ast.body.members[0];

			assert.strictEqual(getRawKey(fooNode, sourceCode), "foo");
		});

		it("should return correct raw key for `String` nodes with single quotes", () => {
			const barNode = parseResult.ast.body.members[1];

			assert.strictEqual(getRawKey(barNode, sourceCode), "bar");
		});

		it("should return correct raw key for `Identifier` nodes", () => {
			const bazNode = parseResult.ast.body.members[2];

			assert.strictEqual(getRawKey(bazNode, sourceCode), "baz");
		});
	});
});
