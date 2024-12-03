/**
 * @fileoverview Rule to detect unsafe values in JSON.
 * @author Bradley Meck Farias
 */

// RFC 8259's `number` production, as a regex.  Capture the integer part
// and the fractional part.
const NUMBER =
	/^-?(?<int>0|([1-9][0-9]*))(?:\.(?<frac>[0-9]+))?(?:[eE][+-]?[0-9]+)?$/u;
const NON_ZERO = /[1-9]/u;

export default {
	meta: {
		type: /** @type {const} */ ("problem"),

		docs: {
			description:
				"Disallow JSON values that are unsafe for interchange.  This includes strings with unmatched surrogates, numbers that evaluate to Infinity, numbers that evaluate to zero unintentionally, numbers that look like integers but they are too large, and subnormal numbers (see: https://en.wikipedia.org/wiki/Subnormal_number)",
		},

		messages: {
			unsafeNumber: "Number outside safe range found.",
			unsafeInteger: "Integer outside safe range found.",
			unsafeZero:
				"This number will evaluate to zero, which is unintended.",
			subnormal:
				"Unexpected subnormal number '{{ value }}' found.  Subnormal numbers are outside the safe range.",
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
				} else {
					const txt = context.sourceCode.getText(node);

					// Also matches -0, intentionally
					if (node.value === 0) {
						// If the value has been rounded down to 0, but there was some
						// fraction or non-zero part before the e-, this is a very small
						// number that doesn't fit inside an f64.
						const match = txt.match(NUMBER);
						// assert(match, "If the regex is right, match is always truthy")

						// If any part of the number other than the  has a non-zero digit
						// in it, this number was not intended to be evaluated down to a
						// zero.
						if (
							NON_ZERO.test(match.groups.int) ||
							NON_ZERO.test(match.groups.frac)
						) {
							context.report({
								loc: node.loc,
								messageId: "unsafeZero",
							});
						}
					} else if (!txt.match(/[.e]/iu)) {
						// Intended to be an integer
						if (
							node.value > Number.MAX_SAFE_INTEGER ||
							node.value < Number.MIN_SAFE_INTEGER
						) {
							context.report({
								loc: node.loc,
								messageId: "unsafeInteger",
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
								data: node,
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
