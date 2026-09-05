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
 * @import { JSONRuleVisitor, JSONRuleDefinition } from "../types.js";
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
			url: "https://github.com/eslint/json/blob/main/docs/rules/no-duplicate-keys.md",
		},

		messages: {
			duplicateKey: 'Duplicate key "{{key}}" found.',
		},
	},

	create(context) {
		/** @type {Array<Set<string>|undefined>} */
		const objectKeys = [];

		/** @type {Set<string>|undefined} */
		let keys;

		return /** @type {JSONRuleVisitor} */ ({
			Object() {
				objectKeys.push(keys);
				keys = new Set();
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
					keys.add(key);
				}
			},

			"Object:exit"() {
				keys = objectKeys.pop();
			},
		});
	},
});
