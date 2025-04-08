import json from "@eslint/json";
import { ESLint } from "eslint";
import type { JSONSyntaxElement, JSONRuleDefinition } from "@eslint/json/types";

json satisfies ESLint.Plugin;
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

// Check that types are imported correctly from `@humanwhocodes/momoa`.
({
	start: { line: 1, column: 1, offset: 1 },
	end: { line: 1, column: 1, offset: 1 },
}) satisfies JSONSyntaxElement["loc"];
({
	// @ts-expect-error -- This is not a valid Location.
	start: 100,
	end: { line: 1, column: 1, offset: 1 },
}) satisfies JSONSyntaxElement["loc"];

// All options optional - JSONRuleDefinition and JSONRuleDefinition<{}>
// should be the same type.
(rule1: JSONRuleDefinition, rule2: JSONRuleDefinition<{}>) => {
	rule1 satisfies typeof rule2;
	rule2 satisfies typeof rule1;
};

// Type restrictions should be enforced
(): JSONRuleDefinition<{
	RuleOptions: [string, number];
	MessageIds: "foo" | "bar";
	ExtRuleDocs: { foo: string; bar: number };
}> => ({
	meta: {
		messages: {
			foo: "FOO",

			// @ts-expect-error Wrong type for message ID
			bar: 42,
		},
		docs: {
			foo: "FOO",

			// @ts-expect-error Wrong type for declared property
			bar: "BAR",

			// @ts-expect-error Wrong type for predefined property
			description: 42,
		},
	},
	create({ options }) {
		// Types for rule options
		options[0] satisfies string;
		options[1] satisfies number;

		return {};
	},
});

// Undeclared properties should produce an error
(): JSONRuleDefinition<{
	MessageIds: "foo" | "bar";
	ExtRuleDocs: { foo: number; bar: string };
}> => ({
	meta: {
		messages: {
			foo: "FOO",

			// Declared message ID is not required
			// bar: "BAR",

			// @ts-expect-error Undeclared message ID is not allowed
			baz: "BAZ",
		},
		docs: {
			foo: 42,

			// Declared property is not required
			// bar: "BAR",

			// @ts-expect-error Undeclared property key is not allowed
			baz: "BAZ",

			// Predefined property is allowed
			description: "Lorem ipsum",
		},
	},
	create() {
		return {};
	},
});
