/**
 * @fileoverview Rule to prevent duplicate keys in JSON.
 * @author Nicholas C. Zakas
 */

export default {
	meta: {
		type: "problem",

		docs: {
			description: "Disallow duplicate keys in JSON objects",
		},

		messages: {
			duplicateKey: 'Duplicate key "{{key}}" found.',
		},
	},

	create(context) {
		const objectKeys = [];
		let keys;

		return {
			Object() {
				keys = new Map();
				objectKeys.push(keys);
			},
			Member(node) {
				const key = node.name.value;

				if (keys.has(key)) {
					context.report({
						loc: node.name.loc,
						messageId: "duplicateKey",
						data: {
							key,
						},
					});
				} else {
					keys.set(key, node);
				}
			},
			"Object:exit"() {
				objectKeys.pop();
			},
		};
	},
};
