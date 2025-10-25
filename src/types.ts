/**
 * @fileoverview Additional types for this package.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import type {
	CustomRuleDefinitionType,
	CustomRuleTypeDefinitions,
	RuleVisitor,
} from "@eslint/core";
import type {
	DocumentNode,
	MemberNode,
	ElementNode,
	ObjectNode,
	ArrayNode,
	StringNode,
	NullNode,
	NumberNode,
	BooleanNode,
	NaNNode,
	InfinityNode,
	IdentifierNode,
	AnyNode,
	Token,
} from "@humanwhocodes/momoa";
import type { JSONLanguageOptions, JSONSourceCode } from "./index.js";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/** Adds matching `:exit` selectors for all properties of a `RuleVisitor`. */
type WithExit<RuleVisitorType extends RuleVisitor> = {
	[Key in keyof RuleVisitorType as
		| Key
		| `${Key & string}:exit`]: RuleVisitorType[Key];
};

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * A JSON syntax element, including nodes and tokens.
 */
export type JSONSyntaxElement = Token | AnyNode;

/**
 * The visitor format returned from rules in this package.
 */
export interface JSONRuleVisitor
	extends RuleVisitor,
		WithExit<{
			[Node in AnyNode as Node["type"]]?:
				| ((node: Node) => void)
				| undefined;
		}> {}

export type JSONRuleDefinitionTypeOptions = CustomRuleTypeDefinitions;

export type JSONRuleDefinition<
	Options extends Partial<JSONRuleDefinitionTypeOptions> = {},
> = CustomRuleDefinitionType<
	{
		LangOptions: JSONLanguageOptions;
		Code: JSONSourceCode;
		Visitor: JSONRuleVisitor;
		Node: AnyNode;
	},
	Options
>;
