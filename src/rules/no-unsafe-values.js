/**
 * @fileoverview Rule to detect unsafe values in JSON.
 * @author Bradley Meck Farias
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/** @typedef {"unsafeNumber"|"unsafeInteger"|"unsafeZero"|"subnormal"|"loneSurrogate"} NoUnsafeValuesMessageIds */
/** @typedef {import("../types.ts").JSONRuleDefinition<[], NoUnsafeValuesMessageIds>} NoUnsafeValuesRuleDefinition */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/*
 * This rule is based on the JSON grammar from RFC 8259, section 6.
 * https://tools.ietf.org/html/rfc8259#section-6
 *
 * We separately capture the integer and fractional parts of a number, so that
 * we can check for unsafe numbers that will evaluate to Infinity.
 */
const NUMBER =
	/^-?(?<int>0|([1-9][0-9]*))(?:\.(?<frac>[0-9]+))?(?:[eE][+-]?[0-9]+)?$/u;
const NON_ZERO = /[1-9]/u;

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
			unsafeNumber: "The number '{{ value }}' will evaluate to Infinity.",
			unsafeInteger:
				"The integer '{{ value }}' is outside the safe integer range.",
			unsafeZero: "The number '{{ value }}' will evaluate to zero.",
			subnormal:
				"Unexpected subnormal number '{{ value }}' found, which may cause interoperability issues.",
			loneSurrogate: "Lone surrogate '{{ surrogate }}' found.",
		},
	},

	create(context) {
		return {
			Number(node) {
				const value = context.sourceCode.getText(node);

				if (Number.isFinite(node.value) !== true) {
					context.report({
						loc: node.loc,
						messageId: "unsafeNumber",
						data: { value },
					});
				} else {
					// Also matches -0, intentionally
					if (node.value === 0) {
						// If the value has been rounded down to 0, but there was some
						// fraction or non-zero part before the e-, this is a very small
						// number that doesn't fit inside an f64.
						const match = value.match(NUMBER);
						// assert(match, "If the regex is right, match is always truthy")

						// If any part of the number other than the exponent has a
						// non-zero digit in it, this number was not intended to be
						// evaluated down to a zero.
						if (
							NON_ZERO.test(match.groups.int) ||
							NON_ZERO.test(match.groups.frac)
						) {
							context.report({
								loc: node.loc,
								messageId: "unsafeZero",
								data: { value },
							});
						}
					} else if (!/[.e]/iu.test(value)) {
						// Intended to be an integer
						if (
							node.value > Number.MAX_SAFE_INTEGER ||
							node.value < Number.MIN_SAFE_INTEGER
						) {
							context.report({
								loc: node.loc,
								messageId: "unsafeInteger",
								data: { value },
							});
						}
					} else {
						// Floating point.  Check for subnormal.
						const buffer = new ArrayBuffer(8);
						const view = new DataView(buffer);
						view.setFloat64(0, node.value, false);
						const asBigInt = view.getBigUint64(0, false);
						// Subnormals have an 11-bit exponent of 0 and a non-zero mantissa.
						if ((asBigInt & 0x7ff0000000000000n) === 0n) {
							context.report({
								loc: node.loc,
								messageId: "subnormal",
								// Value included so that it's seen in scientific notation
								data: {
									value,
								},
							});
						}
					}
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
