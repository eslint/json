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
// Helpers
//-----------------------------------------------------------------------------

/**
 * Escapes a normalized string key and wraps it in its original quotes.
 * @param {string} normalizedKey The normalized key to escape.
 * @param {string} keyText The original key text, including quotes.
 * @returns {string} The escaped and quoted key.
 */
function escapeKey(normalizedKey, keyText) {
	const quote = keyText[0];
	const escapedKey = normalizedKey
		.replaceAll("\\", "\\\\")
		.replaceAll(quote, `\\${quote}`);

	return `${quote}${escapedKey}${quote}`;
}

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

							const fixedKey =
								name.type === "String"
									? escapeKey(
											normalizedKey,
											context.sourceCode.getText(name),
										)
									: normalizedKey;

							return fixer.replaceText(name, fixedKey);
						},
					});
				}
			},
		});
	},
});
