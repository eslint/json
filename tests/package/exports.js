/**
 * @fileoverview Tests for the package index's exports.
 * @author Steve Dodier-Lazaro
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import * as exports from "../../src/index.js";
import assert from "node:assert";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Package exports", () => {
	it("has the ESLint plugin as a default export", () => {
		assert.deepStrictEqual(Object.keys(exports.default), [
			"meta",
			"languages",
			"rules",
			"configs",
		]);
	});

	it("has a JSONLanguage export", () => {
		assert.ok(exports.JSONLanguage);
	});

	it("has a JSONSourceCode export", () => {
		assert.ok(exports.JSONSourceCode);
	});
});
