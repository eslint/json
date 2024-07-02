/**
 * @fileoverview Rule to prevent duplicate keys in JSON.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

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
				objectKeys.push(keys);
				keys = new Map();
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
				keys = objectKeys.pop();
			},
		};
	},
};
