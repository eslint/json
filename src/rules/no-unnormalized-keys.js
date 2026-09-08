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
 * @import { JSONRuleVisitor, JSONRuleDefinition } from "../types.js";
 * @typedef {"unnormalizedKey"} NoUnnormalizedKeysMessageIds
 * @typedef {{ form: string }} NoUnnormalizedKeysOptions
 * @typedef {JSONRuleDefinition<{ RuleOptions: [NoUnnormalizedKeysOptions], MessageIds: NoUnnormalizedKeysMessageIds }>} NoUnnormalizedKeysRuleDefinition
 */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

export default /** @satisfies {NoUnnormalizedKeysRuleDefinition} */ ({
	meta: {
		type: "problem",
		languages: ["json/json", "json/jsonc", "json/json5"],

		fixable: "code",

		docs: {
			recommended: true,
			description: "Disallow JSON keys that are not normalized",
			dialects: ["JSON", "JSONC", "JSON5"],
			url: "https://github.com/eslint/json/blob/main/docs/rules/no-unnormalized-keys.md",
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

		return /** @type {JSONRuleVisitor} */ ({
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

							if (name.type === "String") {
								const quote =
									context.sourceCode.getText(name)[0];
								const escapedKey = normalizedKey
									.replaceAll("\\", "\\\\")
									.replaceAll(quote, `\\${quote}`);

								return fixer.replaceTextRange(
									[name.range[0] + 1, name.range[1] - 1],
									escapedKey,
								);
							}

							return fixer.replaceText(name, normalizedKey);
						},
					});
				}
			},
		});
	},
});
