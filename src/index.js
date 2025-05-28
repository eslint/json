/**
 * @fileoverview JSON plugin.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { JSONLanguage } from "./languages/json-language.js";
import { JSONSourceCode } from "./languages/json-source-code.js";
import noDuplicateKeys from "./rules/no-duplicate-keys.js";
import noEmptyKeys from "./rules/no-empty-keys.js";
import noUnsafeValues from "./rules/no-unsafe-values.js";
import noUnnormalizedKeys from "./rules/no-unnormalized-keys.js";
import sortKeys from "./rules/sort-keys.js";
import topLevelInterop from "./rules/top-level-interop.js";

//-----------------------------------------------------------------------------
// Plugin
//-----------------------------------------------------------------------------

const plugin = {
	meta: {
		name: "@eslint/json",
		version: "0.13.0", // x-release-please-version
	},
	languages: {
		json: new JSONLanguage({ mode: "json" }),
		jsonc: new JSONLanguage({ mode: "jsonc" }),
		json5: new JSONLanguage({ mode: "json5" }),
	},
	rules: {
		"no-duplicate-keys": noDuplicateKeys,
		"no-empty-keys": noEmptyKeys,
		"no-unsafe-values": noUnsafeValues,
		"no-unnormalized-keys": noUnnormalizedKeys,
		"sort-keys": sortKeys,
		"top-level-interop": topLevelInterop,
	},
	configs: {
		recommended: {
			plugins: {},
			rules: /** @type {const} */ ({
				"json/no-duplicate-keys": "error",
				"json/no-empty-keys": "error",
				"json/no-unsafe-values": "error",
				"json/no-unnormalized-keys": "error",
			}),
		},
	},
};

// eslint-disable-next-line no-lone-blocks -- The block syntax { ... } ensures that TypeScript does not get confused about the type of `plugin`.
{
	plugin.configs.recommended.plugins.json = plugin;
}

export default plugin;
export { JSONSourceCode };
export * from "./languages/json-language.js";
