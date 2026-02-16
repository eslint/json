/**
 * @fileoverview Rule to detect unnormalized keys in JSON.
 * @author Bradley Meck Farias
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { getKey, getRawKey } from "../util.js";

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

		fixable: "code",

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
				const rawKey = getRawKey(node, context.sourceCode);
				const normalizedKey = key.normalize(form);

				if (normalizedKey !== key) {
					const { name } = node;

					context.report({
						loc: name.loc,
						messageId: "unnormalizedKey",
						data: {
							key: rawKey,
						},
						fix(fixer) {
							if (key !== rawKey) {
								// Do not perform auto-fix when the raw key contains escape sequences.
								return null;
							}

							return fixer.replaceTextRange(
								name.type === "String"
									? [name.range[0] + 1, name.range[1] - 1]
									: name.range,
								normalizedKey,
							);
						},
					});
				}
			},
		};
	},
};

export default rule;
