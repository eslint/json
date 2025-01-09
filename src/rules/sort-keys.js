/**
 * @fileoverview Rule to require JSON object keys to be sorted. Cribbed largely from https://github.com/eslint/eslint/blob/main/lib/rules/sort-keys.js
 * @author Robin Thomas
 */

import naturalCompare from "natural-compare";

/**
 * Functions which check that the given 2 names are in specific order.
 *
 * Postfix `I` is meant insensitive.
 * Postfix `N` is meant natural.
 * @private
 */
const isValidOrders = {
	asc(a, b) {
		return a <= b;
	},
	ascI(a, b) {
		return a.toLowerCase() <= b.toLowerCase();
	},
	ascN(a, b) {
		return naturalCompare(a, b) <= 0;
	},
	ascIN(a, b) {
		return naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0;
	},
	desc(a, b) {
		return isValidOrders.asc(b, a);
	},
	descI(a, b) {
		return isValidOrders.ascI(b, a);
	},
	descN(a, b) {
		return isValidOrders.ascN(b, a);
	},
	descIN(a, b) {
		return isValidOrders.ascIN(b, a);
	},
};

export default {
	meta: {
		defaultOptions: [
			"asc",
			{
				allowLineSeparatedGroups: false,
				caseSensitive: true,
				minKeys: 2,
				natural: false,
			},
		],

		docs: {
			description: `Require JSON object keys to be sorted`,
		},

		messages: {
			sortKeys:
				"Expected object keys to be in {{natural}}{{insensitive}}{{order}}ending order. '{{thisName}}' should be before '{{prevName}}'.",
		},

		schema: [
			{
				enum: ["asc", "desc"],
			},
			{
				type: "object",
				properties: {
					caseSensitive: {
						type: "boolean",
					},
					natural: {
						type: "boolean",
					},
					minKeys: {
						type: "integer",
						minimum: 2,
					},
					allowLineSeparatedGroups: {
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],

		type: "suggestion",
	},

	create(context) {
		const [order, { caseSensitive, natural, minKeys }] = context.options;
		const insensitive = !caseSensitive;
		const isValidOrder =
			isValidOrders[
				order + (insensitive ? "I" : "") + (natural ? "N" : "")
			];

		// The stack to save the previous property's name for each object literals.
		let stack = null;

		return {
			Object(node) {
				stack = {
					upper: stack,
					prevNode: null,
					prevBlankLine: false,
					prevName: null,
					numKeys: node.members.length,
				};
			},

			Member(node) {
				const prevName = stack.prevName;
				const numKeys = stack.numKeys;
				const thisName = node.name.value;

				stack.prevNode = node;

				if (thisName !== null) {
					stack.prevName = thisName;
				}

				// if (allowLineSeparatedGroups && isBlankLineBetweenNodes) {
				// 	stack.prevBlankLine = thisName === null;
				// 	return;
				// }

				if (
					prevName === null ||
					thisName === null ||
					numKeys < minKeys
				) {
					return;
				}

				if (!isValidOrder(prevName, thisName)) {
					context.report({
						node,
						loc: node.name.loc,
						messageId: "sortKeys",
						data: {
							thisName,
							prevName,
							order,
							insensitive: insensitive ? "insensitive " : "",
							natural: natural ? "natural " : "",
						},
					});
				}
			},
		};
	},
};
