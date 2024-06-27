/**
 * @fileoverview Tests for no-empty-keys rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import rule from "../../src/rules/no-empty-keys.js";
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

ruleTester.run("no-empty-keys", rule, {
	valid: ['{"foo": 1, "bar": 2}'],
	invalid: [
		{
			code: '{"": 1}',
			errors: [
				{
					messageId: "emptyKey",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: '{"  ": 1}',
			errors: [
				{
					messageId: "emptyKey",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
	],
});
