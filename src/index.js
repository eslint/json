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

//-----------------------------------------------------------------------------
// Plugin
//-----------------------------------------------------------------------------

const plugin = {
	meta: {
		name: "@eslint/json",
		version: "0.6.0", // x-release-please-version
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
	},
	configs: {},
};

Object.assign(plugin.configs, {
	recommended: {
		plugins: { json: plugin },
		rules: {
			"json/no-duplicate-keys": "error",
			"json/no-empty-keys": "error",
			"json/no-unsafe-values": "error",
		},
	},
});

export default plugin;
export { JSONLanguage, JSONSourceCode };
