/**
 * @fileoverview Tests for sort-keys rule.
 * @author Robin Thomas
 */

import rule from "../../src/rules/sort-keys.js";
import json from "../../src/index.js";
import { RuleTester } from "eslint";

const ruleTester = new RuleTester({
	plugins: {
		json,
	},
	language: "json/json",
});

ruleTester.run("sort-keys", rule, {
	valid: [
		"[]",
		"{}",

		//#region ascending
		'{"a": 1, "b": 1}',
		'{"a": 1, "a": 1}',
		'{"a": 1, "b": 1, "b": 1}',
		'{"a": 1, "b": {"a": 1, "b": {"a": 1, "b": 1}}}',
		//#endregion

		//#region descending
		{
			code: '{"b": 1, "a": 1}',
			options: ["desc"],
		},
		{
			code: '{"a": 1, "a": 1}',
			options: ["desc"],
		},
		{
			code: '{"b": 1, "a": {"b": 1, "a": {"b": 1, "a": 1}}}',
			options: ["desc"],
		},
		//#endregion

		//#region minKeys
		{
			code: '{"c": 1, "b": 1, "a": 1}',
			options: [
				"asc",
				{
					minKeys: 4,
				},
			],
		},
		//#endregion

		//#region case sensitivity
		'{"A": 1, "B": 1, "a": 1, "b": 1}',
		{
			code: '{"b": 1, "a": 1, "B": 1, "A": 1}',
			options: ["desc"],
		},
		{
			code: '{"bet": 1, "bat": 1, "BET": 1, "BAT": 1}',
			options: ["desc"],
		},
		{
			code: '{"A": 1, "a": 1, "b": 1, "B": 1}',
			options: [
				"asc",
				{
					caseSensitive: false,
				},
			],
		},
		{
			code: '{"Aa": 1, "ab": 1, "ba": 1, "Bb": 1}',
			options: [
				"asc",
				{
					caseSensitive: false,
				},
			],
		},
		{
			code: '{"BOT": 1, "bet": 1, "bAt": 1}',
			options: [
				"desc",
				{
					caseSensitive: false,
				},
			],
		},
		//#endregion
	],
	invalid: [
		{
			code: '{"b": 1, "a": 2}',
			errors: [
				{
					messageId: "sortKeys",
					data: {
						insensitive: "",
						natural: "",
						order: "asc",
						thisName: "a",
						prevName: "b",
					},
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},

		{
			code: '{"a": 1, "b": {"a": 1, "b": { "b": 1, "a": 2}}}',
			errors: [
				{
					messageId: "sortKeys",
					data: {
						insensitive: "",
						natural: "",
						order: "asc",
						thisName: "a",
						prevName: "b",
					},
					line: 1,
					column: 39,
					endLine: 1,
					endColumn: 42,
				},
			],
		},
	],
});
