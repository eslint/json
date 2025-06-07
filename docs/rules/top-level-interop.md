# top-level-interop

Require the JSON top-level value to be an array or object.

## Background

The JSON specification technically allows any JSON value (object, array, string, number, boolean, or null) to be used as the top-level element of a JSON document. However, some older JSON parsers, especially those created before [RFC 7158](https://datatracker.ietf.org/doc/html/rfc7158)/[4627](https://datatracker.ietf.org/doc/html/rfc4627) was fully adopted, only support objects or arrays as the root element.

Additionally, some security practices (such as those preventing JSON hijacking attacks) rely on the assumption that the top-level value is an object or array. Using an object or array at the top level also provides better extensibility for your data structures over time.

## Rule Details

This rule warns when the top-level item in the document is neither an array nor an object. This can be enabled to ensure maximal interoperability with the oldest JSON parsers.

Examples of **incorrect** code for this rule:

```jsonc
/* eslint json/top-level-interop: "error" */

"just a string"

42

true

null
```

Examples of **correct** code for this rule:

```jsonc
/* eslint json/top-level-interop: "error" */

{
  "property": "value",
  "otherProperty": 123
}

["element", "anotherElement"]

{}

[]
```

## When Not to Use It

You might want to disable this rule if:

1. You know that all consumers of your JSON data support primitive values at the root level.
1. You're working with JSON5 or other JSON-like formats that have different constraints.
1. You're specifically using JSON to represent a single value within a constrained system where the receivers expect primitive values.
1. You're generating JSON for internal use where interoperability with older parsers is not a concern.
