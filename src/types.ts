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
// Types
//------------------------------------------------------------------------------

type ValueNodeParent = DocumentNode | MemberNode | ElementNode;

/**
 * A JSON syntax element, including nodes and tokens.
 */
export type JSONSyntaxElement = Token | AnyNode;

type JSONNodeVisitor = {
	Array?: ((node: ArrayNode, parent: ValueNodeParent) => void) | undefined;
	Boolean?:
		| ((node: BooleanNode, parent: ValueNodeParent) => void)
		| undefined;
	Document?: ((node: DocumentNode) => void) | undefined;
	Element?: ((node: ElementNode, parent: ArrayNode) => void) | undefined;
	Identifier?:
		| ((node: IdentifierNode, parent: MemberNode) => void)
		| undefined;
	Infinity?:
		| ((node: InfinityNode, parent: ValueNodeParent) => void)
		| undefined;
	Member?: ((node: MemberNode, parent: ObjectNode) => void) | undefined;
	NaN?: ((node: NaNNode, parent: ValueNodeParent) => void) | undefined;
	Null?: ((node: NullNode, parent: ValueNodeParent) => void) | undefined;
	Number?: ((node: NumberNode, parent: ValueNodeParent) => void) | undefined;
	Object?: ((node: ObjectNode, parent: ValueNodeParent) => void) | undefined;
	String?: ((node: StringNode, parent: ValueNodeParent) => void) | undefined;
};

/**
 * The visitor format returned from rules in this package.
 */
export interface JSONRuleVisitor
	extends RuleVisitor,
		WithExit<JSONNodeVisitor> {}

export type JSONRuleDefinitionTypeOptions = CustomRuleTypeDefinitions;

export type JSONRuleDefinition<
	Options extends Partial<JSONRuleDefinitionTypeOptions> = {},
> = CustomRuleDefinitionType<
	{
		LangOptions: JSONLanguageOptions;
		Code: JSONSourceCode;
		Visitor: JSONRuleVisitor;
		Node: JSONSyntaxElement;
	},
	Options
>;
