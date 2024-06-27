/**
 * @fileoverview Tests for no-duplicate-keys rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import rule from "../../src/rules/no-duplicate-keys.js";
import json from "../../src/index.js";
import { RuleTester } from "eslint";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	plugins: {
		json,
	},
	language: "json/json",
});

ruleTester.run("no-duplicate-keys", rule, {
	valid: [
		'{"foo": 1, "bar": 2}',
		'{"foo": 1, "bar": 2, "baz": 3}',
		"[]",
		"{}",
		'{"foo": 1, "bar": {"bar": 2}}',
	],
	invalid: [
		{
			code: '{"foo": 1, "foo": 2}',
			errors: [
				{
					messageId: "duplicateKey",
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
	],
});
