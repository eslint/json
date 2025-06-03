# sort-keys

Require JSON object keys to be sorted.

## Background

Maintaining consistent ordering of keys in JSON objects can significantly improve readability, especially in large files. When keys follow a predictable sort order, it becomes easier to locate specific properties, spot differences between objects, and manage changes over time. Sorted keys also help reduce unnecessary differences in version control systems when properties are added or removed, as the surrounding properties maintain their relative positions.

This rule enforces a consistent ordering of keys within JSON objects based on the specified sort order (alphabetical by default). It is based on ESLint's [`sort-keys`](https://eslint.org/docs/latest/rules/sort-keys) rule, adapted specifically for JSON documents.

## Rule Details

This rule warns when keys are not in the specified order.

```jsonc
/* eslint json/sort-keys: "error" */

{"a": 1, "c": 3, "b": 2}

// Case-sensitive by default.
{"a": 1, "b": 2, "C": 3}

// Non-natural order by default.
{"1": "a", "2": "c", "10": "b"}

// Nested objects are checked too
{
  "sorted": true,
  "data": {
    "z": 26,
    "a": 1
  }
}
```

Examples of **correct** code for this rule:

```jsonc
/* eslint json/sort-keys: "error" */

{"a": 1, "b": 2, "c": 3}

// Case-sensitive by default.
{"C": 3, "a": 1, "b": 2}

// Non-natural order by default.
{"1": "a", "10": "b", "2": "c"}

// Nested objects are correctly sorted
{
  "data": {
    "a": 1,
    "z": 26
  },
  "sorted": true
}

// Empty objects are valid
{}
```

## Options

The following options are available on this rule:

The **1st option** is `"asc"` or `"desc"`.

- `"asc"` (default) - enforce properties to be in ascending order.
- `"desc"` - enforce properties to be in descending order.

The **2nd option** is an object which has the following properties.

- `caseSensitive` - if `true`, enforce properties to be in case-sensitive order. Default is `true`.
- `natural` - if `true`, enforce properties to be in natural order. Default is `false`. Natural Order compares strings containing combination of letters and numbers in the way a human being would sort. It basically sorts numerically, instead of sorting alphabetically. So the number `10` comes after the number `3` in Natural Sorting.
- `minKeys` - Specifies the minimum number of keys that an object should have in order for the object's unsorted keys to produce an error. Default is `2`, which means by default all objects with unsorted keys will result in lint errors.
- `allowLineSeparatedGroups` - if `true`, the rule allows to group object keys through line breaks. In other words, a blank line after a property will reset the sorting of keys. Default is `false`.

Example for a list:

- With `natural` as `true`, the ordering would be:
  1
  3
  6
  8
  10
- With `natural` as `false`, the ordering would be:
  1
  10
  3
  6
  8

### `desc`

Examples of **incorrect** code for the `"desc"` option:

```jsonc
/* eslint json/sort-keys: ["error", "desc"] */

{"b": 2, "c": 3, "a": 1}

// Case-sensitive by default.
{"C": 1, "b": 3, "a": 2}

// Non-natural order by default.
{"10": "b", "2": "c", "1": "a"}
```

Examples of **correct** code for the `"desc"` option:

```jsonc
/* eslint json/sort-keys: ["error", "desc"] */

{"c": 3, "b": 2, "a": 1}

// Case-sensitive by default.
{"b": 3, "a": 2, "C": 1}

// Non-natural order by default.
{"2": "c", "10": "b", "1": "a"}
```

### `caseSensitive`

Examples of **incorrect** code for the `{ caseSensitive: false }` option:

```jsonc
/* eslint json/sort-keys: ["error", "asc", { caseSensitive: false }] */

{"a": 1, "c": 3, "C": 4, "b": 2}

{"a": 1, "C": 3, "c": 4, "b": 2}
```

Examples of **correct** code for the `{ caseSensitive: false }` option:

```jsonc
/* eslint json/sort-keys: ["error", "asc", { caseSensitive: false }] */

{"a": 1, "b": 2, "c": 3, "C": 4}

{"a": 1, "b": 2, "C": 3, "c": 4}
```

### `natural`

Examples of **incorrect** code for the `{ natural: true }` option:

```jsonc
/* eslint json/sort-keys: ["error", "asc", { natural: true }] */

{ "1": "a", "10": "c", "2": "b" }
```

Examples of **correct** code for the `{ natural: true }` option:

```jsonc
/* eslint json/sort-keys: ["error", "asc", { natural: true }] */

{ "1": "a", "2": "b", "10": "c" }
```

### `minKeys`

Examples of **incorrect** code for the `{ minKeys: 4 }` option:

```jsonc
/* eslint json/sort-keys: ["error", "asc", { minKeys: 4 }] */

// 4 keys
{
    "b": 2,
    "a": 1, // not sorted correctly (should be 1st key)
    "c": 3,
    "d": 4
}

// 5 keys
{
    "2": "a",
    "1": "b", // not sorted correctly (should be 1st key)
    "3": "c",
    "4": "d",
    "5": "e"
}
```

Examples of **correct** code for the `{ minKeys: 4 }` option:

```jsonc
/* eslint json/sort-keys: ["error", "asc", { minKeys: 4 }] */

// 3 keys
{
    "b": 2,
    "a": 1,
    "c": 3
}

// 2 keys
{
    "2": "b",
    "1": "a"
}
```

### `allowLineSeparatedGroups`

Examples of **incorrect** code for the `{ allowLineSeparatedGroups: true }` option:

```jsonc
/* eslint json/sort-keys: ["error", "asc", { allowLineSeparatedGroups: true }] */

{
    "b": 1,
    "a": 3
}

{
    "b": 1,
    "c": 2,

    "y": 3
}

{
    "b": 1,
    "c": 2,

    // comment
    "y": 3,
}

{
    "b": 1
    // comment before comma
    , "a": 2
}
```

Examples of **correct** code for the `{ allowLineSeparatedGroups: true }` option:

```jsonc
/* eslint json/sort-keys: ["error", "asc", { allowLineSeparatedGroups: true }] */

{
    "e": 1,
    "f": 2,
    "g": 3,

    "a": 4,
    "b": 5,
    "c": 6
}

{
    "b": 1,

    // comment
    "a": 4,
    "c": 5,
}

{
    "c": 1,
    "d": 2,

    "e": 3,
}

{
    "c": 1,
    "d": 2,
    // comment

    // comment
    "e": 4
}

{
    "b",

    "a"
}

{
    "b": 1
    // comment before comma

    ,
    "a": 2
}

{
    "b": 1,

    "a": 2,
    "c": 3
}
```

## When Not to Use It

If you don't want to notify about properties' order, then it's safe to disable this rule.
