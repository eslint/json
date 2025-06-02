# no-empty-keys

Disallow empty keys in JSON objects.

## Background

In JSON, using empty keys (keys that are empty strings or contain only whitespace) can lead to accessibility and maintenance issues. While technically valid in JSON, empty keys make objects harder to read, can cause confusion when debugging, and may create problems with some JSON parsers or processors. Additionally, empty keys often indicate mistakes or oversights in the document creation process. This rule helps ensure your JSON objects have meaningful, identifiable keys.

> [!NOTE]
>
> `package-lock.json` uses empty keys intentionally.

## Rule Details

This rule warns when there is a key in an object that is an empty string or contains only whitespace.

Examples of **incorrect** code for this rule:

```jsonc
/* eslint json/no-empty-keys: "error" */

{
  "": "value"
}

{
  "validKey": "value",
  "": "another value"
}

{
  " ": "space as key"
}

{
  "\t": "tab as key"
}

{
  "\n": "newline as key"
}
```

Examples of **correct** code for this rule:

```jsonc
/* eslint json/no-empty-keys: "error" */

{
  "key": "value"
}

{
  "id": 1,
  "name": "product"
}

// All keys must contain at least one non-whitespace character
{
  "key1": "value1",
  "key2": {
    "nestedKey": "nested value"
  }
}

// Empty objects are valid
{}
```

## When Not to Use It

You might want to disable this rule when working with specific JSON files that intentionally use empty keys as part of their schema or format. For example, as noted in the background, `package-lock.json` files sometimes use empty keys by design.

If you're working with JSON data from external systems that you cannot modify, and these systems use empty keys in their response format, you might need to disable this rule for those specific files.
