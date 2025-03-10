/**
 * @fileoverview Rule to detect unnormalized keys in JSON.
 * @author Bradley Meck Farias
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/** @typedef {"unnormalizedKey"} NoUnnormalizedKeysMessageIds */
/** @typedef {import("../types.ts").JSONRuleDefinition<[], NoUnnormalizedKeysMessageIds>} NoUnnormalizedKeysRuleDefinition */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

/** @type {NoUnnormalizedKeysRuleDefinition} */
const rule = {
	meta: {
		type: /** @type {const} */ ("problem"),

		docs: {
			description: "Disallow JSON keys that are not normalized",
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
	},

	create(context) {
		const options = /** @type {{form:string}[]} */ (context.options);
		const form = options.length ? options[0].form : undefined;

		return {
			Member(node) {
				const key =
					node.name.type === "String"
						? node.name.value
						: node.name.name;

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
