# no-unsafe-values

Warns on values that are unsafe for interchange, such as strings with unmatched [surrogates](https://en.wikipedia.org/wiki/UTF-16), numbers that evaluate to Infinity, numbers that evaluate to zero unintentionally, numbers that look like integers but are too large, and [subnormal numbers](https://en.wikipedia.org/wiki/Subnormal_number).

## Background

## Rule Details

Examples of **incorrect** code for this rule:

```jsonc
/* eslint json/no-unsafe-values: "error" */

```

Exmples of **correct** code for this rule:

```jsonc
/* eslint json/no-unsafe-values: "error" */

```

## Options

## When Not to Use It
