/**
 * @fileoverview Rule to prevent duplicate keys in JSON.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/** @typedef {import("../types.ts").JSONRuleVisitor} JSONRuleVisitor */
/** @typedef {import("../../../rewrite/packages/core/src/types.ts").RuleDefinition<JSONRuleVisitor>} RuleDefinition */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

/** @type {RuleDefinition} */
export default {
	meta: {
		type: /** @type {const} */ ("problem"),

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
