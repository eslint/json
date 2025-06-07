# no-duplicate-keys

Disallow duplicate keys in JSON objects.

## Background

The JSON specification doesn't explicitly forbid duplicate keys, but using them is considered a bad practice as it can lead to confusion and errors. Most parsers will only use the last occurrence of a duplicate key while others will throw an error. As such, it's considered a best practice to only have unique keys in JSON objects.

## Rule Details

This rule warns when there are two keys in an object with the same text, including when Unicode escape sequences resolve to the same character. For JSON5, this rule also considers identifier keys with the same text as string keys.

Examples of **incorrect** code for this rule:

```json5
/* eslint json/no-duplicate-keys: "error" */

{
  "foo": 1,
  "foo": 2
}

{
  "foo": {
    "bar": 5
  },
  "foo": 6
}

// With Unicode escapes that resolve to the same key
{
  "f\u006fot": 1,
  "fo\u006ft": 2
}
```

Examples of **correct** code for this rule:

```jsonc
/* eslint json/no-duplicate-keys: "error" */

{
  "foo": 1,
  "bar": 2
}

{
  "foo": 1,
  "bar": 2,
  "baz": 3
}

// Empty objects are valid
{}

// Nested objects with the same keys at different levels are valid
{
  "foo": 1,
  "bar": {
    "bar": 2
  }
}

{
  "foo": {
    "bar": 5
  },
  "bar": 6
}
```

## When Not to Use It

You might want to disable this rule in the rare case where you intentionally need to include duplicate keys in a JSON document for interoperability with systems that rely on this pattern. However, this is not recommended and usually indicates a design issue in the consuming application.

If you're working with non-standard JSON processors that have specific semantics for duplicate keys (such as using them for array-like constructs), you might need to disable this rule. However, consider using a more appropriate data structure or format for such cases.
