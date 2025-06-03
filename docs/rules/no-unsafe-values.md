# no-unsafe-values

Disallow JSON values that are unsafe for interchange.

## Background

JSON is widely used for data interchange between systems, but certain values can cause interoperability issues when transferred between different parsers and environments. This rule warns about potentially problematic values:

- **Lone surrogates in strings**: Incomplete Unicode character pairs that can cause encoding/decoding failures
- **Numbers that evaluate to Infinity**: Values like `1e400` that exceed JavaScript's number range
- **Unintentional zeros**: Very small numbers (e.g., `1e-400`) that silently evaluate to zero due to precision limitations
- **Unsafe integers**: Numbers outside JavaScript's safe integer range (`±2^53-1`) that lose precision
- **Subnormal numbers**: Very small floating point values that may be handled differently across systems

These issues can lead to data corruption, silent failures, or inconsistent behavior across different platforms and languages.

## Rule Details

This rule warns on values that are unsafe for interchange, such as strings with unmatched [surrogates](https://en.wikipedia.org/wiki/UTF-16), numbers that evaluate to Infinity, numbers that evaluate to zero unintentionally, numbers that look like integers but are too large, and [subnormal numbers](https://en.wikipedia.org/wiki/Subnormal_number).

Examples of **incorrect** code for this rule:

```jsonc
/* eslint json/no-unsafe-values: "error" */

[
	2e308, // Number evaluating to Infinity

	-2e308, // Number evaluating to -Infinity

	"\ud83d", // String with lone surrogate

	1e-400, // Unsafe zero (too small, will evaluate to 0)

	9007199254740992, // Unsafe integer (outside safe integer range)

	2.2250738585072009e-308, // Subnormal number
]
```

Examples of **correct** code for this rule:

```jsonc
/* eslint json/no-unsafe-values: "error" */

[
	123,
	1234,
	12345, // Regular numbers within safe range

	"🔥", // Properly formed Unicode character (fire emoji)

	"\ud83d\udd25", // Same character with proper surrogate pair

	0.0,
	0,
	0.0, // Zero represented in different valid ways
]
```

## When Not to Use It

You might want to disable this rule if:

1. **Legacy System Compatibility**: You're working with legacy systems that rely on these potentially problematic values for specific functionality.

2. **Controlled Environment**: Your JSON is only used in a controlled environment where you've thoroughly tested handling of these edge cases.

3. **Intentional Usage**: You specifically need to represent values at the edges of floating-point precision or have legitimate use cases for lone surrogates.

In most cases, however, using this rule helps prevent subtle bugs and interoperability issues when exchanging data between different systems and programming languages.
