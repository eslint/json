# no-unnormalized-keys

Warns on keys containing [unnormalized characters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize#description). You can optionally specify the normalization form via `{ form: "form_name" }`, where `form_name` can be any of `"NFC"`, `"NFD"`, `"NFKC"`, or `"NFKD"`.

## Background

## Rule Details

Examples of **incorrect** code for this rule:

```jsonc
/* eslint json/no-unnormalized-keys: "error" */

```

Exmples of **correct** code for this rule:

```jsonc
/* eslint json/no-unnormalized-keys: "error" */

```

## Options

## When Not to Use It
