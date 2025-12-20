/**
 * @fileoverview Tests for top-level-interop rule.
 * @author Joe Hildebrand
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import rule from "../../src/rules/top-level-interop.js";
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

ruleTester.run("top-level-interop", rule, {
	valid: [
		"[]",
		"[1]",
		"[1, 2]",
		{
			code: "[1]",
			language: "json/jsonc",
		},
		{
			code: "[1, 2]",
			language: "json/jsonc",
		},
		{
			code: "[1]",
			language: "json/json5",
		},
		{
			code: "[1, 2]",
			language: "json/json5",
		},
		"{}",
		'{"foo": 1}',
		'{"foo": 1, "foo": 2}',
		{
			code: '{"foo": 1}',
			language: "json/jsonc",
		},
		{
			code: '{"foo": 1, "foo": 2}',
			language: "json/jsonc",
		},
		{
			code: '{"foo": 1}',
			language: "json/json5",
		},
		{
			code: '{"foo": 1, "foo": 2}',
			language: "json/json5",
		},
	],
	invalid: [
		{
			code: "1",
			errors: [
				{
					messageId: "topLevel",
					data: {
						type: "Number",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 2,
				},
			],
		},
		{
			code: "true",
			errors: [
				{
					messageId: "topLevel",
					data: {
						type: "Boolean",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "null",
			errors: [
				{
					messageId: "topLevel",
					data: {
						type: "Null",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: '"foo"',
			errors: [
				{
					messageId: "topLevel",
					data: {
						type: "String",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
	],
});
