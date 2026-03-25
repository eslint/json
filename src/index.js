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
		version: "1.2.0", // x-release-please-version
	},
	languages: {
		json: new JSONLanguage({ mode: "json" }),
		jsonc: new JSONLanguage({ mode: "jsonc" }),
		json5: new JSONLanguage({ mode: "json5" }),
	},
	rules,
	configs: {
		recommended: {
			name: "@eslint/json/recommended",
			plugins: /** @type {{}} */ ({
				get json() {
					return plugin;
				},
			}),
			rules: recommendedRules,
		},
	},
};

export default plugin;
export { JSONSourceCode };
export * from "./languages/json-language.js";
export * from "./types.js";
