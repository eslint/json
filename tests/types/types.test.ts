import json, { JSONSourceCode } from "@eslint/json";
import type { ESLint } from "eslint";
import type {
	JSONSyntaxElement,
	JSONRuleDefinition,
	JSONRuleVisitor,
} from "@eslint/json/types";
import type {
	AnyNode,
	ArrayNode,
	BooleanNode,
	DocumentNode,
	ElementNode,
	IdentifierNode,
	InfinityNode,
	MemberNode,
	NaNNode,
	NullNode,
	NumberNode,
	ObjectNode,
	StringNode,
} from "@humanwhocodes/momoa";
import type { SourceLocation, SourceRange } from "@eslint/core";

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

{
	type ApplyInlineConfigLoc = ReturnType<
		JSONSourceCode["applyInlineConfig"]
	>["configs"][0]["loc"];

	// Check that `applyInlineConfig`'s return type includes correct `loc` structure.
	const loc: ApplyInlineConfigLoc = {
		start: { line: 1, column: 1, offset: 0 },
		end: { line: 1, column: 1, offset: 0 },
	};
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

(): JSONRuleDefinition => ({
	create({ sourceCode }): JSONRuleVisitor {
		sourceCode satisfies JSONSourceCode;
		sourceCode.ast satisfies DocumentNode;
		sourceCode.lines satisfies string[];
		sourceCode.text satisfies string;

		function testVisitor<NodeType extends AnyNode>(
			node: NodeType,
			parent?:
				| DocumentNode
				| MemberNode
				| ElementNode
				| ArrayNode
				| ObjectNode,
		) {
			sourceCode.getLoc(node) satisfies SourceLocation;
			sourceCode.getLocFromIndex(0) satisfies {
				line: number;
				column: number;
			};
			sourceCode.getIndexFromLoc({ line: 1, column: 1 }) satisfies number;
			sourceCode.getRange(node) satisfies SourceRange;
			sourceCode.getParent(node) satisfies AnyNode | undefined;
			sourceCode.getAncestors(node) satisfies JSONSyntaxElement[];
			sourceCode.getText(node) satisfies string;
			sourceCode.applyInlineConfig().configs[0].loc.start
				.offset satisfies JSONSyntaxElement["loc"]["start"]["offset"];
			sourceCode.applyInlineConfig().configs[0].loc.end
				.offset satisfies JSONSyntaxElement["loc"]["end"]["offset"];
		}

		return {
			Array: (...args) => testVisitor<ArrayNode>(...args),
			"Array:exit": (...args) => testVisitor<ArrayNode>(...args),
			Boolean: (...args) => testVisitor<BooleanNode>(...args),
			"Boolean:exit": (...args) => testVisitor<BooleanNode>(...args),
			Document: (...args) => testVisitor<DocumentNode>(...args),
			"Document:exit": (...args) => testVisitor<DocumentNode>(...args),
			Element: (...args) => testVisitor<ElementNode>(...args),
			"Element:exit": (...args) => testVisitor<ElementNode>(...args),
			Identifier: (...args) => testVisitor<IdentifierNode>(...args),
			"Identifier:exit": (...args) =>
				testVisitor<IdentifierNode>(...args),
			Infinity: (...args) => testVisitor<InfinityNode>(...args),
			"Infinity:exit": (...args) => testVisitor<InfinityNode>(...args),
			Member: (...args) => testVisitor<MemberNode>(...args),
			"Member:exit": (...args) => testVisitor<MemberNode>(...args),
			NaN: (...args) => testVisitor<NaNNode>(...args),
			"NaN:exit": (...args) => testVisitor<NaNNode>(...args),
			Null: (...args) => testVisitor<NullNode>(...args),
			"Null:exit": (...args) => testVisitor<NullNode>(...args),
			Number: (...args) => testVisitor<NumberNode>(...args),
			"Number:exit": (...args) => testVisitor<NumberNode>(...args),
			Object: (...args) => testVisitor<ObjectNode>(...args),
			"Object:exit": (...args) => testVisitor<ObjectNode>(...args),
			String: (...args) => testVisitor<StringNode>(...args),
			"String:exit": (...args) => testVisitor<StringNode>(...args),
		};
	},
});

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

// `meta.docs.recommended` can be any type
(): JSONRuleDefinition => ({
	create() {
		return {};
	},
	meta: {
		docs: {
			recommended: {
				severity: "warn",
				options: ["never"],
			},
		},
	},
});
