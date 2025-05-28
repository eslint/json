/**
 * @fileoverview Rule to prevent duplicate keys in JSON.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @import { MemberNode } from "@humanwhocodes/momoa";
 * @import { JSONRuleDefinition } from "../types.ts";
 *
 * @typedef {"duplicateKey"} NoDuplicateKeysMessageIds
 * @typedef {JSONRuleDefinition<{ MessageIds: NoDuplicateKeysMessageIds }>} NoDuplicateKeysRuleDefinition
 */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

/** @type {NoDuplicateKeysRuleDefinition} */
const rule = {
	meta: {
		type: "problem",

		docs: {
			recommended: true,
			description: "Disallow duplicate keys in JSON objects",
			url: "https://github.com/eslint/json#rules",
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

export default rule;
