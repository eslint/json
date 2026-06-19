/**
 * @fileoverview Rule to prevent duplicate keys in JSON.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { getKey, getRawKey } from "../util.js";

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @import { MemberNode } from "@humanwhocodes/momoa";
 * @import { JSONRuleDefinition } from "../types.js";
 * @typedef {"duplicateKey"} NoDuplicateKeysMessageIds
 * @typedef {JSONRuleDefinition<{ MessageIds: NoDuplicateKeysMessageIds }>} NoDuplicateKeysRuleDefinition
 */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

export default /** @satisfies {NoDuplicateKeysRuleDefinition} */ ({
	meta: {
		type: "problem",
		languages: ["json/json", "json/jsonc", "json/json5"],

		docs: {
			recommended: true,
			description: "Disallow duplicate keys in JSON objects",
			dialects: ["JSON", "JSONC", "JSON5"],
			url: "https://github.com/eslint/json/tree/main/docs/rules/no-duplicate-keys.md",
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
				const key = getKey(node);
				const rawKey = getRawKey(node, context.sourceCode);

				if (keys.has(key)) {
					context.report({
						loc: node.name.loc,
						messageId: "duplicateKey",
						data: {
							key: rawKey,
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
});
