import json from "@eslint/json";
// import { ESLint } from "eslint";

// json satisfies ESLint.Plugin;
json.meta.name satisfies string;
json.meta.version satisfies string;

// Check that these languages are defined:
json.languages.json satisfies object;
json.languages.json5 satisfies object;
json.languages.jsonc satisfies object;

// Check that `plugins` in the recommended config is defined:
json.configs.recommended.plugins satisfies object;

{
	type RecommendedRuleName = keyof typeof json.configs.recommended.rules;
	type RuleName = `json/${keyof typeof json.rules}`;
	type AssertAllNamesIn<T1 extends T2, T2> = never;

	// Check that all recommended rule names match the names of existing rules in this plugin.
	null as AssertAllNamesIn<RecommendedRuleName, RuleName>;
}
