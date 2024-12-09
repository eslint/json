/**
 * @fileoverview Tests for no-unsafe-values rule.
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
		"0.00000",
		"0e0000000",
		"0.00000e0000",
	],
	invalid: [
		{
			code: "2e308",
			errors: [
				{
					messageId: "unsafeNumber",
					data: {
						value: "2e308",
					},
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
					data: {
						value: "-2e308",
					},
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
		{
			code: "1e-400",
			errors: [
				{
					messageId: "unsafeZero",
					data: {
						value: "1e-400",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "-1e-400",
			errors: [
				{
					messageId: "unsafeZero",
					data: {
						value: "-1e-400",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "0.01e-400",
			errors: [
				{
					messageId: "unsafeZero",
					data: {
						value: "0.01e-400",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "-10.2e-402",
			errors: [
				{
					messageId: "unsafeZero",
					data: {
						value: "-10.2e-402",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: `0.${"0".repeat(400)}1`,
			errors: [
				{
					messageId: "unsafeZero",
					data: {
						value: `0.${"0".repeat(400)}1`,
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 404,
				},
			],
		},
		{
			code: "9007199254740992",
			errors: [
				{
					messageId: "unsafeInteger",
					data: {
						value: "9007199254740992",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "-9007199254740992",
			errors: [
				{
					messageId: "unsafeInteger",
					data: {
						value: "-9007199254740992",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "2.2250738585072009e-308",
			errors: [
				{
					messageId: "subnormal",
					data: {
						value: "2.2250738585072009e-308",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "-2.2250738585072009e-308",
			errors: [
				{
					messageId: "subnormal",
					data: {
						value: "-2.2250738585072009e-308",
					},
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
	],
});
