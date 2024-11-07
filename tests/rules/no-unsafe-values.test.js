/**
 * @fileoverview Tests for no-empty-keys rule.
 * @author Bradley Meck Farias
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import rule from "../../src/rules/no-unsafe-values.js";
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

ruleTester.run("no-unsafe-values", rule, {
	valid: [
		"123",
		{
			code: "1234",
			language: "json/json5",
		},
		{
			code: "12345",
			language: "json/json5",
		},
		'"🔥"',
		'"\\ud83d\\udd25"',
	],
	invalid: [
		{
			code: "2e308",
			errors: [
				{
					messageId: "unsafeNumber",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "-2e308",
			errors: [
				{
					messageId: "unsafeNumber",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: '"\ud83d"',
			errors: [
				{
					messageId: "loneSurrogate",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: '"\\ud83d"',
			errors: [
				{
					messageId: "loneSurrogate",
					data: { surrogate: "\\ud83d" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: '"\udd25"',
			errors: [
				{
					messageId: "loneSurrogate",
					data: { surrogate: "\\udd25" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: '"\\udd25"',
			errors: [
				{
					messageId: "loneSurrogate",
					data: { surrogate: "\\udd25" },
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: '"\ud83d\ud83d"',
			errors: [
				{
					message: "Lone surrogate '\\ud83d' found.",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
				{
					message: "Lone surrogate '\\ud83d' found.",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
	],
});
