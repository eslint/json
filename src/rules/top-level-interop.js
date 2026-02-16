/**
 * @fileoverview Rule to ensure top-level items are either an array or object.
 * @author Joe Hildebrand
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @import { JSONRuleDefinition } from "../types.js";
 * @typedef {"topLevel"} TopLevelInteropMessageIds
 * @typedef {JSONRuleDefinition<{ MessageIds: TopLevelInteropMessageIds }>} TopLevelInteropRuleDefinition
 */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

/** @type {TopLevelInteropRuleDefinition} */
const rule = {
	meta: {
		type: "problem",

		docs: {
			recommended: false,
			description:
				"Require the JSON top-level value to be an array or object",
			url: "https://github.com/eslint/json/tree/main/docs/rules/top-level-interop.md",
		},

		messages: {
			topLevel:
				"Top level item should be array or object, got '{{type}}'.",
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

export default rule;
