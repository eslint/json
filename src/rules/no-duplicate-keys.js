/**
 * @fileoverview Rule to prevent duplicate keys in JSON.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/** @typedef {"duplicateKey"} NoDuplicateKeysMessageIds */
/** @typedef {import("../types.ts").JSONRuleDefinition<[], NoDuplicateKeysMessageIds>} NoDuplicateKeysRuleDefinition */
/** @typedef {import("@humanwhocodes/momoa").MemberNode} MemberNode */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

/** @type {NoDuplicateKeysRuleDefinition} */
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
		/** @type {Array<Map<string, MemberNode>|undefined>} */
		const objectKeys = [];

		/** @type {Map<string, MemberNode>|undefined} */
		let keys;

		return {
			Object() {
				objectKeys.push(keys);
				keys = new Map();
			},

			Member(node) {
				const key =
					node.name.type === "String"
						? node.name.value
						: node.name.name;

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
