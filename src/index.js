/**
 * @fileoverview JSON plugin.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { JSONLanguage } from "./languages/json-language.js";
import noDuplicateKeys from "./rules/no-duplicate-keys.js";
import noEmptyKeys from "./rules/no-empty-keys.js";

//-----------------------------------------------------------------------------
// Plugin
//-----------------------------------------------------------------------------

const plugin = {
	meta: {
		name: "@eslint/json",
		version: "0.1.0", // x-release-please-version
	},
	languages: {
		json: new JSONLanguage({ mode: "json" }),
		jsonc: new JSONLanguage({ mode: "jsonc" }),
	},
	rules: {
		"no-duplicate-keys": noDuplicateKeys,
		"no-empty-keys": noEmptyKeys,
	},
	configs: {},
};

Object.assign(plugin.configs, {
	recommended: {
		plugins: { json: plugin },
		rules: {
			"json/no-duplicate-keys": "error",
			"json/no-empty-keys": "error",
		},
	},
});

export default plugin;
