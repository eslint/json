/**
 * @fileoverview Rule to detect unsafe values in JSON.
 * @author Bradley Meck Farias
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/** @typedef {"unsafeNumber"|"loneSurrogate"} NoUnsafeValuesMessageIds */
/** @typedef {import("../types.ts").JSONRuleDefinition<[], NoUnsafeValuesMessageIds>} NoUnsafeValuesRuleDefinition */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

/** @type {NoUnsafeValuesRuleDefinition} */
export default {
	meta: {
		type: "problem",

		docs: {
			description: "Disallow JSON values that are unsafe for interchange",
		},

		messages: {
			unsafeNumber: "Number outside safe range found.",
			loneSurrogate: "Lone surrogate '{{ surrogate }}' found.",
		},
	},

	create(context) {
		return {
			Number(node) {
				if (Number.isFinite(node.value) !== true) {
					context.report({
						loc: node.loc,
						messageId: "unsafeNumber",
					});
				}
			},
			String(node) {
				if (node.value.isWellFormed) {
					if (node.value.isWellFormed()) {
						return;
					}
				}
				// match any high surrogate and, if it exists, a paired low surrogate
				// match any low surrogate not already matched
				const surrogatePattern =
					/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/gu;
				let match = surrogatePattern.exec(node.value);
				while (match) {
					// only need to report non-paired surrogates
					if (match[0].length < 2) {
						context.report({
							loc: node.loc,
							messageId: "loneSurrogate",
							data: {
								surrogate: JSON.stringify(match[0]).slice(
									1,
									-1,
								),
							},
						});
					}
					match = surrogatePattern.exec(node.value);
				}
			},
		};
	},
};
