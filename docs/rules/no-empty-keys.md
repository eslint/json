# no-empty-keys

Disallow empty keys in JSON objects.

## Background

This rule warns when there is a key in an object that is an empty string or contains only whitespace. (NOTE: `package-lock.json` uses empty keys intentionally.)

## Rule Details

Examples of **incorrect** code for this rule:

```jsonc
/* eslint json/no-empty-keys: "error" */

```

Examples of **correct** code for this rule:

```jsonc
/* eslint json/no-empty-keys: "error" */

```

## Options

## When Not to Use It
