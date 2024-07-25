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

This package exports these languages:

-   `"json/json"` is for regular JSON files
-   `"json/jsonc"` is for JSON files that support comments ([JSONC](https://github.com/microsoft/node-jsonc-parser)) such as those used for Visual Studio Code configuration files
-   `"json/json5"` is for [JSON5](https://json5.org) files

Depending on which types of JSON files you'd like to lint, you can set up your `eslint.config.js` file to include just the files you'd like. Here's an example that lints JSON, JSONC, and JSON5 files:

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
			"json/no-duplicate-keys": "error",
		},
	},

	// lint JSONC files
	{
		files: ["**/*.jsonc", ".vscode/*.json"],
		language: "json/jsonc",
		rules: {
			"json/no-duplicate-keys": "error",
		},
	},

	// lint JSON5 files
	{
		files: ["**/*.json5"],
		language: "json/json5",
		rules: {
			"json/no-duplicate-keys": "error",
		},
	},
];
```

## Recommended Configuration

To use the recommended configuration for this plugin, specify your matching `files` and then use the `json.configs.recommended` object, like this:

```js
import json from "@eslint/json";

export default [
	// lint JSON files
	{
		files: ["**/*.json"],
		ignores: ["package-lock.json"],
		language: "json/json",
		...json.configs.recommended,
	},

	// lint JSONC files
	{
		files: ["**/*.jsonc"],
		language: "json/jsonc",
		...json.configs.recommended,
	},

	// lint JSON5 files
	{
		files: ["**/*.json5"],
		language: "json/json5",
		...json.configs.recommended,
	},
];
```

**Note:** You generally want to ignore `package-lock.json` because it is auto-generated and you typically will not want to manually make changes to it.

## Rules

-   `no-duplicate-keys` - warns when there are two keys in an object with the same text.
-   `no-empty-keys` - warns when there is a key in an object that is an empty string or contains only whitespace (note: `package-lock.json` uses empty keys intentionally)

## License

Apache 2.0
