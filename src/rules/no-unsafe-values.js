/**
 * @fileoverview Rule to detect unsafe values in JSON.
 * @author Bradley Meck Farias
 */

// These numbers evaluated to zero unexpectedly.  If the group's digits
// are all zero, that's fine.
const SMALL_NUMBERS = [/\.(\d+)/u, /((?:\d+\.)?\d+)e/iu];

export default {
	meta: {
		type: /** @type {const} */ ("problem"),

		docs: {
			description: "Disallow JSON values that are unsafe for interchange",
		},

		messages: {
			unsafeNumber: "Number outside safe range found.",
			unsafeInteger: "Integer outside safe range found.",
			subnormal: "Subnormal numbers are outside the safe range.",
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
					if (node.value === 0) {
						// If the value has been rounded down to 0, but there was some fraction
						// or non-zero part before an e-, this is a very small number that doesn't
						// fit inside an f64.
						for (const r of SMALL_NUMBERS) {
							const m = txt.match(r);
							// If the digits are all 0, it's ok.
							if (m?.[1]?.match(/[1-9]/u)) {
								context.report({
									loc: node.loc,
									messageId: "unsafeNumber",
								});
								break;
							}
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
						const ab = new ArrayBuffer(8);
						const dv = new DataView(ab);
						dv.setFloat64(0, node.value, false);
						const bi = dv.getBigUint64(0, false);
						// Subnormals have an 11-bit exponent of 0 and a non-zero mantissa.
						if ((bi & 0x7ff0000000000000n) === 0n) {
							context.report({
								loc: node.loc,
								messageId: "subnormal",
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
