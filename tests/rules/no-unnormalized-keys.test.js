/**
 * @fileoverview Tests for no-unnormalized-keys rule.
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
			options: [{ form: "NFC" }],
		},
		{
			code: `{"${o.normalize("NFD")}":"NFD"}`,
			options: [{ form: "NFD" }],
		},
		{
			code: `{"${o.normalize("NFKC")}":"NFKC"}`,
			options: [{ form: "NFKC" }],
		},
		{
			code: `{"${o.normalize("NFKD")}":"NFKD"}`,
			options: [{ form: "NFKD" }],
		},
	],
	invalid: [
		{
			code: `{"${o.normalize("NFD")}":"NFD"}`,
			output: `{"${o.normalize("NFC")}":"NFD"}`,
			errors: [
				{
					messageId: "unnormalizedKey",
					data: { key: o.normalize("NFD") },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: `{"${o.normalize("NFD")}":"NFD"}`,
			output: `{"${o.normalize("NFC")}":"NFD"}`,
			language: "json/jsonc",
			errors: [
				{
					messageId: "unnormalizedKey",
					data: { key: o.normalize("NFD") },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: `{"${o.normalize("NFD")}":"NFD"}`,
			output: `{"${o.normalize("NFC")}":"NFD"}`,
			language: "json/json5",
			errors: [
				{
					messageId: "unnormalizedKey",
					data: { key: o.normalize("NFD") },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: `{'${o.normalize("NFD")}':'NFD'}`,
			output: `{'${o.normalize("NFC")}':'NFD'}`,
			language: "json/json5",
			errors: [
				{
					messageId: "unnormalizedKey",
					data: { key: o.normalize("NFD") },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: `{${o.normalize("NFD")}:"NFD"}`,
			output: `{${o.normalize("NFC")}:"NFD"}`,
			language: "json/json5",
			errors: [
				{
					messageId: "unnormalizedKey",
					data: { key: o.normalize("NFD") },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: `{"${o.normalize("NFKC")}":"NFKC"}`,
			output: `{"${o.normalize("NFKD")}":"NFKC"}`,
			options: [{ form: "NFKD" }],
			errors: [
				{
					messageId: "unnormalizedKey",
					data: { key: o.normalize("NFKC") },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: `{"${o.normalize("NFKC")}":"NFKC"}`,
			output: `{"${o.normalize("NFKD")}":"NFKC"}`,
			language: "json/jsonc",
			options: [{ form: "NFKD" }],
			errors: [
				{
					messageId: "unnormalizedKey",
					data: { key: o.normalize("NFKC") },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: `{"${o.normalize("NFKC")}":"NFKC"}`,
			output: `{"${o.normalize("NFKD")}":"NFKC"}`,
			language: "json/json5",
			options: [{ form: "NFKD" }],
			errors: [
				{
					messageId: "unnormalizedKey",
					data: { key: o.normalize("NFKC") },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: `{'${o.normalize("NFKC")}':"NFKC"}`,
			output: `{'${o.normalize("NFKD")}':"NFKC"}`,
			language: "json/json5",
			options: [{ form: "NFKD" }],
			errors: [
				{
					messageId: "unnormalizedKey",
					data: { key: o.normalize("NFKC") },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: `{${o.normalize("NFKC")}:"NFKC"}`,
			output: `{${o.normalize("NFKD")}:"NFKC"}`,
			language: "json/json5",
			options: [{ form: "NFKD" }],
			errors: [
				{
					messageId: "unnormalizedKey",
					data: { key: o.normalize("NFKC") },
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 3,
				},
			],
		},
	],
});
