/**
 * @fileoverview Rule to prevent empty keys in JSON.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @import { JSONRuleDefinition } from "../types.ts";
 *
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
			url: "https://github.com/eslint/json#rules",
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

export default rule;
