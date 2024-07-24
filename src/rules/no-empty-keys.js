/**
 * @fileoverview Rule to prevent empty keys in JSON.
 * @author Nicholas C. Zakas
 */

export default {
	meta: {
		type: "problem",

		docs: {
			description: "Disallow empty keys in JSON objects",
		},

		messages: {
			emptyKey: "Empty key found.",
		},
	},

	create(context) {
		return {
			Member(node) {
				const key =
					node.name.type === "String"
						? node.name.value
						: node.name.name;

				if (key.trim() === "") {
					context.report({
						loc: node.name.loc,
						messageId: "emptyKey",
					});
				}
			},
		};
	},
};
