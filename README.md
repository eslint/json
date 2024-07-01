# ESLint JSON Language Plugin

## Overview

This package contains a plugin that allows you to natively lint JSON and JSONC files using ESLint.

**Important:** This plugin requires ESLint v9.6.0 or higher and you must be using the [new configuration system](https://eslint.org/docs/latest/use/configure/configuration-files).

## Installation

For Node.js and compatible runtimes:

```shell
npm install @eslint/json -D
# or
yarn add @eslint/json -D
# or
pnpm install @eslint/json -D
# or
bun install @eslint/json -D
```

For Deno:

```shell
deno add @eslint/json
```

## Usage

This package exports two different languages:

-   `"json/json"` is for regular JSON files
-   `"json/jsonc"` is for JSON files that support comments (JSON-C)

Depending on which types of JSON files you'd like to lint, you can set up your `eslint.config.js` file to include just the files you'd like. Here's an example that lints both JSON and JSON-C files:

```js
import json from "@eslint/json";

export default [
	{
		plugins: {
			json,
		},
	},

	// lint JSON files
	{
		files: ["**/*.json"],
		language: "json/json",
		rules: {
			"no-duplicate-keys": "error",
		},
	},

	// lint JSON-C files
	{
		files: ["**/*.jsonc"],
		language: "json/jsonc",
		rules: {
			"no-duplicate-keys": "error",
		},
	},
];
```

## Recommended Configuration

To use the recommended configuration for this plugin, specify your matching `files` and then use the `json.configs.recommended` object, like this:

```js
import json from "@eslint/json";

export default [
	{
		plugins: {
			json,
		},
	},

	// lint JSON files
	{
		files: ["**/*.json"],
		language: "json/json",
		...json.configs.recommended,
	},

	// lint JSON-C files
	{
		files: ["**/*.jsonc"],
		language: "json/jsonc",
		...json.configs.recommended,
	},
];
```

## Rules

-   `no-duplicate-keys` - warns when there are two keys in an object with the same text.
-   `no-empty-keys` - warns when there is a key in an object that is an empty string or contains only whitespace

## License

Apache 2.0
