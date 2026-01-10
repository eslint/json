/**
 * @fileoverview Rule to detect unnormalized keys in JSON.
 * @author Bradley Meck Farias
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { getKey } from "../util.js";

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @import { JSONRuleDefinition } from "../types.js";
 * @typedef {"unnormalizedKey"} NoUnnormalizedKeysMessageIds
 * @typedef {{ form: string }} NoUnnormalizedKeysOptions
 * @typedef {JSONRuleDefinition<{ RuleOptions: [NoUnnormalizedKeysOptions], MessageIds: NoUnnormalizedKeysMessageIds }>} NoUnnormalizedKeysRuleDefinition
 */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

/** @type {NoUnnormalizedKeysRuleDefinition} */
const rule = {
	meta: {
		type: "problem",

		docs: {
			recommended: true,
			description: "Disallow JSON keys that are not normalized",
			url: "https://github.com/eslint/json/tree/main/docs/rules/no-unnormalized-keys.md",
		},

		messages: {
			unnormalizedKey: "Unnormalized key '{{key}}' found.",
		},

		schema: [
			{
				type: "object",
				properties: {
					form: {
						enum: ["NFC", "NFD", "NFKC", "NFKD"],
					},
				},
				additionalProperties: false,
			},
		],

		defaultOptions: [
			{
				form: "NFC",
			},
		],
	},

	create(context) {
		const [{ form }] = context.options;

		return {
			Member(node) {
				const key = getKey(node);

				if (key.normalize(form) !== key) {
					context.report({
						loc: node.name.loc,
						messageId: "unnormalizedKey",
						data: {
							key,
						},
					});
				}
			},
		};
	},
};

export default rule;
