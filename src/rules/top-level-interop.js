/**
 * @fileoverview Rule to ensure top-level items are either an array or ojbect.
 * @author Joe Hildebrand
 */

export default {
	meta: {
		type: /** @type {const} */ ("problem"),

		docs: {
			description:
				"Require the JSON top-level value to be an array or object",
		},

		messages: {
			topLevel:
				"Top level item should be array or object, got \"{{type}}\".",
		},
	},

	create(context) {
		return {
			Document(node) {
				const { type } = node.body;
				if (type !== "Object" && type !== "Array") {
					context.report({
						loc: node.loc,
						messageId: "topLevel",
						data: { type },
					});
				}
			},
		};
	},
};
