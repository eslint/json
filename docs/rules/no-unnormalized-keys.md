# no-unnormalized-keys

Disallow JSON keys that are not normalized.

## Background

Unicode characters can sometimes have multiple representations that look identical but are technically different character sequences. For example, the character "é" can be represented as a single code point (U+00E9) or as an "e" followed by a combining accent (U+0065 + U+0301). This can lead to confusion, comparison issues, and unexpected behavior when working with JSON data.

Using normalized Unicode ensures consistent representation of text, which is important for key comparison, sorting, and searching operations. When keys are properly normalized, operations like key lookups and equality checks will work as expected across different systems and platforms.

## Rule Details

This rule checks that all object keys in your JSON are properly normalized according to Unicode normalization forms. By default, it uses the NFC normalization form, but you can optionally specify the normalization form via `{ form: "form_name" }`, where `form_name` can be any of `"NFC"`, `"NFD"`, `"NFKC"`, or `"NFKD"`. 

Examples of **incorrect** code for this rule:

```jsonc
/* eslint json/no-unnormalized-keys: "error" */

// Key using decomposed form (NFD) instead of composed form (NFC)
{
  "cafe\u0301": "value" // é as 'e' + combining accent
}

// Different representations of the same visual character
{
  "cafè": "espresso",
  "cafe\u0300": "latte" // same visual character in a different form
}
```

Examples of **correct** code for this rule:

```jsonc
/* eslint json/no-unnormalized-keys: "error" */

// Using NFC (default) normalized form
{
  "café": "value" // é as a single code point
}

// All keys properly normalized
{
  "résumé": "document",
  "naïve": "approach",
  "piñata": "party"
}

// ASCII-only keys are always normalized
{
  "simple": "value",
  "no_special_chars": true
}
```

## Options

The following options are available on this rule:

- `form: "NFC" | "NFD" | "NFKC" | "NFKD"` - specifies which Unicode normalization form to use when checking keys. Must be one of: `"NFC"` (default), `"NFD"`, `"NFKC"`, or `"NFKD"`.

    Each normalization form has specific characteristics:

    - **NFC**: Canonical Decomposition followed by Canonical Composition (default)
    - **NFD**: Canonical Decomposition
    - **NFKC**: Compatibility Decomposition followed by Canonical Composition
    - **NFKD**: Compatibility Decomposition

    Examples of **incorrect** code when configured as `"no-unnormalized-keys": ["error", { form: "NFD" }]`:

    ```jsonc
    /* eslint json/no-unnormalized-keys: ["error", { form: "NFD" }] */

    {
    	"café": "value", // é as a single code point is invalid in NFD
    }
    ```

    Examples of **correct** code when configured as `"no-unnormalized-keys": ["error", { form: "NFD" }]`:

    ```jsonc
    /* eslint json/no-unnormalized-keys: ["error", { form: "NFD" }] */

    {
    	"cafe\u0301": "value", // é represented as 'e' + combining accent is valid in NFD
    }
    ```

## When Not to Use It

You might want to disable this rule if:

1. You're working with JSON data from external systems that you cannot modify, and normalizing the keys would break compatibility with those systems.
1. Your project specifically needs to maintain different Unicode representations for technical reasons.
1. Your JSON processing tools or environment have specific requirements regarding Unicode normalization that differ from the standard forms.

In most cases, however, following a consistent normalization form improves interoperability and prevents subtle bugs.
