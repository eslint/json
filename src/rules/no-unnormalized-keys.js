/**
 * @fileoverview Rule to detect unnormalized keys in JSON.
 * @author Bradley Meck Farias
 */

export default {
	meta: {
		type: "problem",

		docs: {
			description: "Disallow JSON keys that are not normalized",
		},

		messages: {
			unnormalizedKey: "Unnormalized key found.",
		},

		schema: {
			type: "array",
			minItems: 0,
			maxItems: 1,
			items: {
				enum: ["NFC", "NFD", "NFKC", "NFKD"],
			},
		},
	},

	create(context) {
		const normalization = context.options.length
			? s => s.normalize(context.options[0])
			: s => s.normalize();
		return {
			Member(node) {
				const key =
					node.name.type === "String"
						? node.name.value
						: node.name.name;

				if (normalization(key) !== key) {
					context.report({
						loc: node.name.loc,
						messageId: "unnormalizedKey",
					});
				}
			},
		};
	},
};
