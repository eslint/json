/**
 * @fileoverview JSON plugin.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { JSONLanguage } from "./languages/json-language.js";
import { JSONSourceCode } from "./languages/json-source-code.js";
import recommendedRules from "./build/recommended-config.js";
import rules from "./build/rules.js";

//-----------------------------------------------------------------------------
// Plugin
//-----------------------------------------------------------------------------

const plugin = {
	meta: {
		name: "@eslint/json",
		version: "0.14.0", // x-release-please-version
	},
	languages: {
		json: new JSONLanguage({ mode: "json" }),
		jsonc: new JSONLanguage({ mode: "jsonc" }),
		json5: new JSONLanguage({ mode: "json5" }),
	},
	rules,
	configs: {
		recommended: {
			plugins: {},
			rules: recommendedRules,
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
