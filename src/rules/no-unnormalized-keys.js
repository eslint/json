/**
 * @fileoverview Rule to detect unnormalized keys in JSON.
 * @author Bradley Meck Farias
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @import { JSONRuleDefinition } from "../types.ts";
 *
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
			Member({ name }) {
				const key = name.type === "String" ? name.value : name.name;
				const normalizedKey = key.normalize(form);

				if (normalizedKey !== key) {
					context.report({
						loc: name.loc,
						messageId: "unnormalizedKey",
						data: {
							key,
						},
						fix(fixer) {
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
