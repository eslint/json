/**
 * @fileoverview Rule to prevent empty keys in JSON.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { getKey } from "../util.js";

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @import { JSONRuleDefinition } from "../types.js";
 * @typedef {"emptyKey"} NoEmptyKeysMessageIds
 * @typedef {JSONRuleDefinition<{ MessageIds: NoEmptyKeysMessageIds }>} NoEmptyKeysRuleDefinition
 */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

/** @type {NoEmptyKeysRuleDefinition} */
const rule = {
	meta: {
		type: "problem",

		docs: {
			recommended: true,
			description: "Disallow empty keys in JSON objects",
			url: "https://github.com/eslint/json/tree/main/docs/rules/no-empty-keys.md",
		},

		messages: {
			emptyKey: "Empty key found.",
		},
	},

	create(context) {
		return {
			Member(node) {
				const key = getKey(node);

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

export default rule;
