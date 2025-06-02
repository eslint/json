# top-level-interop

Require the JSON top-level value to be an array or object.

## Background

This rule warns when the top-level item in the document is neither an array nor an object. This can be enabled to ensure maximal interoperability with the oldest JSON parsers.

## Rule Details

Examples of **incorrect** code for this rule:

```jsonc
/* eslint json/top-level-interop: "error" */

```

Examples of **correct** code for this rule:

```jsonc
/* eslint json/top-level-interop: "error" */

```

## Options

## When Not to Use It
