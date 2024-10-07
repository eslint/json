/**
 * @fileoverview Tests for no-empty-keys rule.
 * @author Bradley Meck Farias
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import rule from "../../src/rules/no-unnormalized-keys.js";
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

const o = "\u1E9B\u0323";

ruleTester.run("no-unnormalized-keys", rule, {
	valid: [
		`{"${o}":"NFC"}`,
		{
			code: `{"${o}":"NFC"}`,
			options: ["NFC"],
		},
		{
			code: `{"${o.normalize("NFD")}":"NFD"}`,
			options: ["NFD"],
		},
		{
			code: `{"${o.normalize("NFKC")}":"NFKC"}`,
			options: ["NFKC"],
		},
		{
			code: `{"${o.normalize("NFKD")}":"NFKD"}`,
			options: ["NFKD"],
		},
	],
	invalid: [
		{
			code: `{"${o.normalize("NFD")}":"NFD"}`,
			errors: [
				{
					messageId: "unnormalizedKey",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
	],
});
