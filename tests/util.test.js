/**
 * @fileoverview Tests for util.js
 * @author 루밀LuMir(lumirlumir)
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import assert from "node:assert";
// import { JSONLanguage } from "../../src/languages/json-language.js";
// import { JSONSourceCode } from "../../src/languages/json-source-code.js";
import {
	getKey,
	// getRawKey
} from "../src/util.js";

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

	/*
	describe("getRawKey()", () => {
		const file = { body: `{"foo": 1, 'bar': 2, baz: 3}` };
		const language = new JSONLanguage({ mode: "jsonc" });
		const parseResult = language.parse(file);
		const sourceCode = new JSONSourceCode({
			text: file.body,
			ast: parseResult.ast,
		});

		it("TODO", () => {
			// TODO
		});
	});
    */
});
