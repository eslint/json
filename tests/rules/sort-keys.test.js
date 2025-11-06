/**
 * @fileoverview Tests for sort-keys rule. Cribbed from https://github.com/eslint/eslint/blob/main/tests/lib/rules/sort-keys.js. TODO: How to maintain parity with eslint/sort-keys?
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
		// default (asc)
		{ code: '{"":1, "a":2}', options: [] },
		{ code: '{"_":2, "a":1, "b":3}', options: [] },
		{ code: '{"a":1, "b":3, "c":2}', options: [] },
		{ code: '{"a":2, "b":3, "b_":1}', options: [] },
		{ code: '{"C":3, "b_":1, "c":2}', options: [] },
		{ code: '{"$":1, "A":3, "_":2, "a":4}', options: [] },
		{
			code: `{$:1, 'A':3, "_":2, a:4}`,
			language: `json/json5`,
			options: [],
		},
		{ code: '{"1":1, "11":2, "2":4, "A":3}', options: [] },
		{ code: '{"#":1, "Z":2, "À":3, "è":4}', options: [] },
		{ code: '{"#":1, Z:2, À:3, è:4}', language: `json/json5`, options: [] },

		// nested
		{ code: '{"a":1, "b":{"x":1, "y":1}, "c":1}', options: [] },
		{
			code: `
						{
							"a":1,
							"b": {
								"x":1,
								"y":1
							},
							"c":1
						}
				`,
			options: [],
		},
		{
			code: `
						[
							{
								"a":1,
								"b": {
									"x":1,
									"y":1
								}
							},
							{
								"c":1,
								"d":1
							}
						]
				`,
			options: [],
		},
		{
			code: `
						[
							{
								"a":1,
								b: {
									"x":1,
									y:1
								}
							},
							{
								"c":1,
								d:1
							}
						]
				`,
			language: "json/json5",
			options: [],
			errors: [
				{
					messageId: "sortKeys",
				},
			],
		},

		// asc
		{
			code: '{"_":2, "a":1, "b":3} // asc"',
			language: "json/jsonc",
			options: ["asc"],
		},
		{ code: '{"a":1, "b":3, "c":2}', options: ["asc"] },
		{ code: '{"a":2, "b":3, "b_":1}', options: ["asc"] },
		{ code: '{"C":3, "b_":1, "c":2}', options: ["asc"] },
		{ code: '{"$":1, "A":3, "_":2, "a":4}', options: ["asc"] },
		{ code: '{"1":1, "11":2, "2":4, "A":3}', options: ["asc"] },
		{ code: '{"#":1, "Z":2, "À":3, "è":4}', options: ["asc"] },

		// asc, minKeys should ignore unsorted keys when number of keys is less than minKeys
		{ code: '{"a":1, "c":2, "b":3}', options: ["asc", { minKeys: 4 }] },

		// asc, insensitive
		{
			code: '{"_":2, "a":1, "b":3} // asc, insensitive',
			language: "json/jsonc",
			options: ["asc", { caseSensitive: false }],
		},
		{
			code: '{"a":1, "b":3, "c":2}',
			options: ["asc", { caseSensitive: false }],
		},
		{
			code: '{"a":2, "b":3, "b_":1}',
			options: ["asc", { caseSensitive: false }],
		},
		{
			code: '{"b_":1, "C":3, "c":2}',
			options: ["asc", { caseSensitive: false }],
		},
		{
			code: '{"b_":1, "c":3, "C":2}',
			options: ["asc", { caseSensitive: false }],
		},
		{
			code: '{"$":1, "_":2, "A":3, "a":4}',
			options: ["asc", { caseSensitive: false }],
		},
		{
			code: '{"1":1, "11":2, "2":4, "A":3}',
			options: ["asc", { caseSensitive: false }],
		},
		{
			code: '{"#":1, "Z":2, "À":3, "è":4}',
			options: ["asc", { caseSensitive: false }],
		},

		// asc, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
		{
			code: '{"$":1, "A":3, "_":2, "a":4}',
			options: ["asc", { caseSensitive: false, minKeys: 5 }],
		},

		// asc, natural
		{
			code: '{"_":2, "a":1, "b":3} // asc, natural',
			language: "json/jsonc",
			options: ["asc", { natural: true }],
		},
		{
			code: '{"a":1, "b":3, "c":2}',
			options: ["asc", { natural: true }],
		},
		{
			code: '{"a":2, "b":3, "b_":1}',
			options: ["asc", { natural: true }],
		},
		{
			code: '{"C":3, "b_":1, "c":2}',
			options: ["asc", { natural: true }],
		},
		{
			code: '{"$":1, "_":2, "A":3, "a":4}',
			options: ["asc", { natural: true }],
		},
		{
			code: '{"1":1, "2":4, "11":2, "A":3}',
			options: ["asc", { natural: true }],
		},
		{
			code: '{"#":1, "Z":2, "À":3, "è":4}',
			options: ["asc", { natural: true }],
		},

		// asc, natural, minKeys should ignore unsorted keys when number of keys is less than minKeys
		{
			code: '{"b_":1, "a":2, "b":3}',
			options: ["asc", { natural: true, minKeys: 4 }],
		},

		// asc, natural, insensitive
		{
			code: '{"_":2, "a":1, "b":3} // asc, natural, insensitive',
			language: "json/jsonc",
			options: ["asc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"a":1, "b":3, "c":2}',
			options: ["asc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"a":2, "b":3, "b_":1}',
			options: ["asc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"b_":1, "C":3, "c":2}',
			options: ["asc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"b_":1, "c":3, "C":2}',
			options: ["asc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"$":1, "_":2, "A":3, "a":4}',
			options: ["asc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"1":1, "2":4, "11":2, "A":3}',
			options: ["asc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"#":1, "Z":2, "À":3, "è":4}',
			options: ["asc", { natural: true, caseSensitive: false }],
		},

		// asc, natural, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
		{
			code: '{"a":1, "_":2, "b":3}',
			options: [
				"asc",
				{ natural: true, caseSensitive: false, minKeys: 4 },
			],
		},

		// desc
		{
			code: '{"b":3, "a":1, "_":2} // desc',
			language: "json/jsonc",
			options: ["desc"],
		},
		{
			code: `{b:3, "a":1, '_':2} // desc`,
			language: "json/json5",
			options: ["desc"],
		},
		{ code: '{"c":2, "b":3, "a":1}', options: ["desc"] },
		{ code: '{"b_":1, "b":3, "a":2}', options: ["desc"] },
		{ code: '{"c":2, "b_":1, "C":3}', options: ["desc"] },
		{ code: '{"a":4, "_":2, "A":3, "$":1}', options: ["desc"] },
		{ code: '{"A":3, "2":4, "11":2, "1":1}', options: ["desc"] },
		{ code: '{"è":4, "À":3, "Z":2, "#":1}', options: ["desc"] },

		// desc, minKeys should ignore unsorted keys when number of keys is less than minKeys
		{
			code: '{"a":1, "c":2, "b":3}',
			options: ["desc", { minKeys: 4 }],
		},

		// desc, insensitive
		{
			code: '{"b":3, "a":1, "_":2} // desc, insensitive',
			language: "json/jsonc",
			options: ["desc", { caseSensitive: false }],
		},
		{
			code: '{"c":2, "b":3, "a":1}',
			options: ["desc", { caseSensitive: false }],
		},
		{
			code: '{"b_":1, "b":3, "a":2}',
			options: ["desc", { caseSensitive: false }],
		},
		{
			code: '{"c":2, "C":3, "b_":1}',
			options: ["desc", { caseSensitive: false }],
		},
		{
			code: '{"C":2, "c":3, "b_":1}',
			options: ["desc", { caseSensitive: false }],
		},
		{
			code: '{"a":4, "A":3, "_":2, "$":1}',
			options: ["desc", { caseSensitive: false }],
		},
		{
			code: '{"A":3, "2":4, "11":2, "1":1}',
			options: ["desc", { caseSensitive: false }],
		},
		{
			code: '{"è":4, "À":3, "Z":2, "#":1}',
			options: ["desc", { caseSensitive: false }],
		},

		// desc, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
		{
			code: '{"$":1, "_":2, "A":3, "a":4}',
			options: ["desc", { caseSensitive: false, minKeys: 5 }],
		},

		// desc, natural
		{
			code: '{"b":3, "a":1, "_":2} // desc, natural',
			language: "json/jsonc",
			options: ["desc", { natural: true }],
		},
		{
			code: '{"c":2, "b":3, "a":1}',
			options: ["desc", { natural: true }],
		},
		{
			code: '{"b_":1, "b":3, "a":2}',
			options: ["desc", { natural: true }],
		},
		{
			code: '{"c":2, "b_":1, "C":3}',
			options: ["desc", { natural: true }],
		},
		{
			code: '{"a":4, "A":3, "_":2, "$":1}',
			options: ["desc", { natural: true }],
		},
		{
			code: '{"A":3, "11":2, "2":4, "1":1}',
			options: ["desc", { natural: true }],
		},
		{
			code: '{"è":4, "À":3, "Z":2, "#":1}',
			options: ["desc", { natural: true }],
		},

		// desc, natural, minKeys should ignore unsorted keys when number of keys is less than minKeys
		{
			code: '{"b_":1, "a":2, "b":3}',
			options: ["desc", { natural: true, minKeys: 4 }],
		},

		// desc, natural, insensitive
		{
			code: '{"b":3, "a":1, "_":2} // desc, natural, insensitive',
			language: "json/jsonc",
			options: ["desc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"c":2, "b":3, "a":1}',
			options: ["desc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"b_":1, "b":3, "a":2}',
			options: ["desc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"c":2, "C":3, "b_":1}',
			options: ["desc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"C":2, "c":3, "b_":1}',
			options: ["desc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"a":4, "A":3, "_":2, "$":1}',
			options: ["desc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"A":3, "11":2, "2":4, "1":1}',
			options: ["desc", { natural: true, caseSensitive: false }],
		},
		{
			code: '{"è":4, "À":3, "Z":2, "#":1}',
			options: ["desc", { natural: true, caseSensitive: false }],
		},

		// desc, natural, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
		{
			code: '{"a":1, "_":2, "b":3}',
			options: [
				"desc",
				{ natural: true, caseSensitive: false, minKeys: 4 },
			],
		},

		// allowLineSeparatedGroups option
		{
			code: `
						{
								"a": 1,
								"b": 2,
								"c": 3,
								"e": 4,
								"f": 5,
								"g": 6
						}
				`,
			options: ["asc", { allowLineSeparatedGroups: false }],
		},
		{
			code: `
						{
								"e": 1,
								"f": 2,
								"g": 3,

								"a": 4,
								"b": 5,
								"c": 6
						}
				`,
			options: ["asc", { allowLineSeparatedGroups: true }],
		},
		{
			code: `
						{
								"b": 1,

								// comment
								"a": 2,
								"c": 3
						}
				`,
			language: "json/jsonc",
			options: ["asc", { allowLineSeparatedGroups: true }],
		},
		{
			code: `
						{
								"b": 1

								,

								// comment
								"a": 2,
								"c": 3
						}
				`,
			language: "json/jsonc",
			options: ["asc", { allowLineSeparatedGroups: true }],
		},
		{
			code: `
						{
								"b": "/*",

								"a": "*/"
						}
				`,
			options: ["asc", { allowLineSeparatedGroups: true }],
		},
		{
			code: `
						{
							"b":1,
							"c": {
								"y":1,
								"z":1,

								"x":1
							},

							"a":1
						}
				`,
			options: ["asc", { allowLineSeparatedGroups: true }],
		},

		{
			code: `
						{
							"b":1,
							a: {
								"y":1,
								x:1,

								"z":1
							},

							c:1
						}
				`,
			language: `json/json5`,
			options: ["desc", { allowLineSeparatedGroups: true }],
		},

		// Commas are not considered separating lines
		{
			code: `
			{
				"b": 1

				,

				"a": 2
			}
			`,
			options: ["asc", { allowLineSeparatedGroups: true }],
		},
		{
			code: `
			{
				"a": 1


				,
				"b": 2
			}
			`,
			options: ["asc", { allowLineSeparatedGroups: false }],
		},
		{
			code: `
						{
								"b": 1
						// comment before comma

						,
						"a": 2
						}
				`,
			language: "json/jsonc",
			options: ["asc", { allowLineSeparatedGroups: true }],
		},
	],
	invalid: [
		// default (asc)
		{
			code: '{"a":1, "":2} // default',
			language: "json/jsonc",
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: '{"a":1, "_":2, "b":3} // default',
			language: "json/jsonc",
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: '{"a":1, "c":2, "b":3}',
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "b",
						prevName: "c",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"b_":1, "a":2, "b":3}',
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "b_",
					},
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: '{"b_":1, "c":2, "C":3}',
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "C",
						prevName: "c",
					},
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: '{"$":1, "_":2, "A":3, "a":4}',
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "A",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"1":1, "2":4, "A":3, "11":2}',
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "11",
						prevName: "A",
					},
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: '{"#":1, "À":3, "Z":2, "è":4}',
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "Z",
						prevName: "À",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},

		// asc
		{
			code: '{"a":1, "_":2, "b":3} // asc',
			language: "json/jsonc",
			options: ["asc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: '{"a":1, "c":2, "b":3}',
			options: ["asc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "b",
						prevName: "c",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"b_":1, "a":2, "b":3}',
			options: ["asc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "b_",
					},
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: '{"b_":1, "c":2, "C":3}',
			options: ["asc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "C",
						prevName: "c",
					},
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: '{"$":1, "_":2, "A":3, "a":4}',
			options: ["asc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "A",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"1":1, "2":4, "A":3, "11":2}',
			options: ["asc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "11",
						prevName: "A",
					},
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: '{"#":1, "À":3, "Z":2, "è":4}',
			options: ["asc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "Z",
						prevName: "À",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},

		// asc, minKeys should error when number of keys is greater than or equal to minKeys
		{
			code: '{"a":1, "_":2, "b":3}',
			options: ["asc", { minKeys: 3 }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},

		// asc, insensitive
		{
			code: '{"a":1, "_":2, "b":3} // asc, insensitive',
			language: "json/jsonc",
			options: ["asc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: '{"a":1, "c":2, "b":3}',
			options: ["asc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "b",
						prevName: "c",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"b_":1, "a":2, "b":3}',
			options: ["asc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "b_",
					},
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: '{"$":1, "A":3, "_":2, "a":4}',
			options: ["asc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "A",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"1":1, "2":4, "A":3, "11":2}',
			options: ["asc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "11",
						prevName: "A",
					},
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: '{"#":1, "À":3, "Z":2, "è":4}',
			options: ["asc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "Z",
						prevName: "À",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},

		// asc, insensitive, minKeys should error when number of keys is greater than or equal to minKeys
		{
			code: '{"a":1, "_":2, "b":3}',
			options: ["asc", { caseSensitive: false, minKeys: 3 }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},

		// asc, natural
		{
			code: '{"a":1, "_":2, "b":3} // asc, natural',
			language: "json/jsonc",
			options: ["asc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: '{"a":1, "c":2, "b":3}',
			options: ["asc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "b",
						prevName: "c",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"b_":1, "a":2, "b":3}',
			options: ["asc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "b_",
					},
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: '{"b_":1, "c":2, "C":3}',
			options: ["asc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "C",
						prevName: "c",
					},
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: '{"$":1, "A":3, "_":2, "a":4}',
			options: ["asc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "A",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"1":1, "2":4, "A":3, "11":2}',
			options: ["asc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "11",
						prevName: "A",
					},
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: '{"#":1, "À":3, "Z":2, "è":4}',
			options: ["asc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "Z",
						prevName: "À",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},

		// asc, natural, minKeys should error when number of keys is greater than or equal to minKeys
		{
			code: '{"a":1, "_":2, "b":3}',
			options: ["asc", { natural: true, minKeys: 2 }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},

		// asc, natural, insensitive
		{
			code: '{"a":1, "_":2, "b":3} // asc, natural, insensitive',
			language: "json/jsonc",
			options: ["asc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: '{"a":1, "c":2, "b":3}',
			options: ["asc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "b",
						prevName: "c",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"b_":1, "a":2, "b":3}',
			options: ["asc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "b_",
					},
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: '{"$":1, "A":3, "_":2, "a":4}',
			options: ["asc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "A",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"1":1, "11":2, "2":4, "A":3}',
			options: ["asc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "2",
						prevName: "11",
					},
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: '{"#":1, "À":3, "Z":2, "è":4}',
			options: ["asc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "Z",
						prevName: "À",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},

		// asc, natural, insensitive, minKeys should error when number of keys is greater than or equal to minKeys
		{
			code: '{"a":1, "_":2, "b":3}',
			options: [
				"asc",
				{ natural: true, caseSensitive: false, minKeys: 3 },
			],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "ascending",
						thisName: "_",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},

		// desc
		{
			code: '{"":1, "a":2} // desc',
			language: "json/jsonc",
			options: ["desc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "a",
						prevName: "",
					},
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: '{"a":1, "_":2, "b":3} // desc',
			language: "json/jsonc",
			options: ["desc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "b",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"a":1, "c":2, "b":3}',
			options: ["desc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "c",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: '{"b_":1, "a":2, "b":3}',
			options: ["desc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "b",
						prevName: "a",
					},
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: '{"b_":1, "c":2, "C":3}',
			options: ["desc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "c",
						prevName: "b_",
					},
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: '{"$":1, "_":2, "A":3, "a":4}',
			options: ["desc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "_",
						prevName: "$",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "a",
						prevName: "A",
					},
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: '{"1":1, "2":4, "A":3, "11":2}',
			options: ["desc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "2",
						prevName: "1",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "A",
						prevName: "2",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"#":1, "À":3, "Z":2, "è":4}',
			options: ["desc"],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "À",
						prevName: "#",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "è",
						prevName: "Z",
					},
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
				},
			],
		},

		// desc, minKeys should error when number of keys is greater than or equal to minKeys
		{
			code: '{"a":1, "_":2, "b":3}',
			options: ["desc", { minKeys: 3 }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "b",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},

		// desc, insensitive
		{
			code: '{"a":1, "_":2, "b":3} // desc, insensitive',
			language: "json/jsonc",
			options: ["desc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "b",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"a":1, "c":2, "b":3}',
			options: ["desc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "c",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: '{"b_":1, "a":2, "b":3}',
			options: ["desc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "b",
						prevName: "a",
					},
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: '{"b_":1, "c":2, "C":3}',
			options: ["desc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "c",
						prevName: "b_",
					},
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: '{"$":1, "_":2, "A":3, "a":4}',
			options: ["desc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "_",
						prevName: "$",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "A",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"1":1, "2":4, "A":3, "11":2}',
			options: ["desc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "2",
						prevName: "1",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "A",
						prevName: "2",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"#":1, "À":3, "Z":2, "è":4}',
			options: ["desc", { caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "À",
						prevName: "#",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "è",
						prevName: "Z",
					},
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
				},
			],
		},

		// desc, insensitive should error when number of keys is greater than or equal to minKeys
		{
			code: '{"a":1, "_":2, "b":3}',
			options: ["desc", { caseSensitive: false, minKeys: 2 }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "b",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},

		// desc, natural
		{
			code: '{"a":1, "_":2, "b":3} // desc, natural',
			language: "json/jsonc",
			options: ["desc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "b",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"a":1, "c":2, "b":3}',
			options: ["desc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "c",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: '{"b_":1, "a":2, "b":3}',
			options: ["desc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "b",
						prevName: "a",
					},
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: '{"b_":1, "c":2, "C":3}',
			options: ["desc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "c",
						prevName: "b_",
					},
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: '{"$":1, "_":2, "A":3, "a":4}',
			options: ["desc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "_",
						prevName: "$",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "A",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "a",
						prevName: "A",
					},
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: '{"1":1, "2":4, "A":3, "11":2}',
			options: ["desc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "2",
						prevName: "1",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "A",
						prevName: "2",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"#":1, "À":3, "Z":2, "è":4}',
			options: ["desc", { natural: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "À",
						prevName: "#",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "è",
						prevName: "Z",
					},
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
				},
			],
		},

		// desc, natural should error when number of keys is greater than or equal to minKeys
		{
			code: '{"a":1, "_":2, "b":3}',
			options: ["desc", { natural: true, minKeys: 3 }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "b",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},

		// desc, natural, insensitive
		{
			code: '{"a":1, "_":2, "b":3} // desc, natural, insensitive',
			language: "json/jsonc",
			options: ["desc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "b",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"a":1, "c":2, "b":3}',
			options: ["desc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "c",
						prevName: "a",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: '{"b_":1, "a":2, "b":3}',
			options: ["desc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "b",
						prevName: "a",
					},
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: '{"b_":1, "c":2, "C":3}',
			options: ["desc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "c",
						prevName: "b_",
					},
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: '{"$":1, "_":2, "A":3, "a":4}',
			options: ["desc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "_",
						prevName: "$",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "A",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: '{"1":1, "2":4, "11":2, "A":3}',
			options: ["desc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "2",
						prevName: "1",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "11",
						prevName: "2",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "A",
						prevName: "11",
					},
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: '{"#":1, "À":3, "Z":2, "è":4}',
			options: ["desc", { natural: true, caseSensitive: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "À",
						prevName: "#",
					},
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 12,
				},
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "è",
						prevName: "Z",
					},
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
				},
			],
		},

		// desc, natural, insensitive should error when number of keys is greater than or equal to minKeys
		{
			code: '{"a":1, "_":2, "b":3}',
			options: [
				"desc",
				{ natural: true, caseSensitive: false, minKeys: 2 },
			],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "natural",
						sensitivity: "insensitive",
						direction: "descending",
						thisName: "b",
						prevName: "_",
					},
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
				},
			],
		},

		// When allowLineSeparatedGroups option is false
		{
			code: `
						{
								"b": 1,
								"c": 2,
								"a": 3
						}
				`,
			options: ["asc", { allowLineSeparatedGroups: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "c",
					},
					// line: 5,
					// column: 33,
					// endLine: 5,
					// endColumn: 36,
				},
			],
		},
		{
			code: `
						{
								"b": 1,

								"c": 2,

								"a": 3
						}
				`,
			options: ["asc", { allowLineSeparatedGroups: false }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "c",
					},
					// line: 1,
					// column: 16,
					// endLine: 1,
					// endColumn: 19,
				},
			],
		},

		// When allowLineSeparatedGroups option is true
		{
			code: `
						{
								"b": "/*",
								"a": "*/"
						}
				`,
			options: ["asc", { allowLineSeparatedGroups: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "b",
					},
					// line: 1,
					// column: 16,
					// endLine: 1,
					// endColumn: 19,
				},
			],
		},
		{
			code: `
						{
								"b": 1
								// comment before comma
								, "a": 2
						}
				`,
			language: "json/jsonc",
			options: ["asc", { allowLineSeparatedGroups: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "b",
					},
					// line: 1,
					// column: 16,
					// endLine: 1,
					// endColumn: 19,
				},
			],
		},
		{
			code: `
						[
							{
								"b":1,
								"a": {
									"x":1,
									"y":1
								},

								"d":1,
								"c":1
							}
						]
				`,
			options: ["desc", { allowLineSeparatedGroups: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "descending",
						thisName: "y",
						prevName: "x",
					},
					// line: 1,
					// column: 16,
					// endLine: 1,
					// endColumn: 19,
				},
			],
		},
		{
			code: `
				{
					"b": /*foo */ 1,
					// some multiline comment
					// using line comment style
					"a": 2 // "a" and "b" are not line separated
				}
			`,
			language: "json/jsonc",
			options: ["asc", { allowLineSeparatedGroups: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "b",
					},
					// line: 1,
					// column: 16,
					// endLine: 1,
					// endColumn: 19,
				},
			],
		},
		{
			code: `
				{
					"b": 1,
					/* some multiline comment
					using block comment style */
					/* the empty line...

					...in this one doesn't count */
					"a": 2 // "a" and "b" are not line separated
				}
			`,
			language: "json/jsonc",
			options: ["asc", { allowLineSeparatedGroups: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "b",
					},
					// line: 1,
					// column: 16,
					// endLine: 1,
					// endColumn: 19,
				},
			],
		},
		{
			code: `
			{
				"b": 1
				,
				"a": 2
			}
			`,
			options: ["asc", { allowLineSeparatedGroups: true }],
			errors: [
				{
					messageId: "sortKeys",
					data: {
						sortName: "alphanumeric",
						sensitivity: "sensitive",
						direction: "ascending",
						thisName: "a",
						prevName: "b",
					},
					// line: 1,
					// column: 16,
					// endLine: 1,
					// endColumn: 19,
				},
			],
		},
	],
});
