/**
 * @fileoverview Additional types for this package.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import type { RuleVisitor, RuleDefinition } from "@eslint/core";
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
// Types
//------------------------------------------------------------------------------

type ValueNodeParent = DocumentNode | MemberNode | ElementNode;

/**
 * A JSON syntax element, including nodes and tokens.
 */
export type JSONSyntaxElement = Token | AnyNode;

/**
 * The visitor format returned from rules in this package.
 */
export interface JSONRuleVisitor extends RuleVisitor {
	Document?(node: DocumentNode): void;
	Member?(node: MemberNode, parent?: ObjectNode): void;
	Element?(node: ElementNode, parent?: ArrayNode): void;
	Object?(node: ObjectNode, parent?: ValueNodeParent): void;
	Array?(node: ArrayNode, parent?: ValueNodeParent): void;
	String?(node: StringNode, parent?: ValueNodeParent): void;
	Null?(node: NullNode, parent?: ValueNodeParent): void;
	Number?(node: NumberNode, parent?: ValueNodeParent): void;
	Boolean?(node: BooleanNode, parent?: ValueNodeParent): void;
	NaN?(node: NaNNode, parent?: ValueNodeParent): void;
	Infinity?(node: InfinityNode, parent?: ValueNodeParent): void;
	Identifier?(node: IdentifierNode, parent?: ValueNodeParent): void;

	"Document:exit"?(node: DocumentNode): void;
	"Member:exit"?(node: MemberNode, parent?: ObjectNode): void;
	"Element:exit"?(node: ElementNode, parent?: ArrayNode): void;
	"Object:exit"?(node: ObjectNode, parent?: ValueNodeParent): void;
	"Array:exit"?(node: ArrayNode, parent?: ValueNodeParent): void;
	"String:exit"?(node: StringNode, parent?: ValueNodeParent): void;
	"Null:exit"?(node: NullNode, parent?: ValueNodeParent): void;
	"Number:exit"?(node: NumberNode, parent?: ValueNodeParent): void;
	"Boolean:exit"?(node: BooleanNode, parent?: ValueNodeParent): void;
	"NaN:exit"?(node: NaNNode, parent?: ValueNodeParent): void;
	"Infinity:exit"?(node: InfinityNode, parent?: ValueNodeParent): void;
	"Identifier:exit"?(node: IdentifierNode, parent?: ValueNodeParent): void;
}

export type JSONRuleDefinitionTypeOptions = {
	RuleOptions: unknown[];
	MessageIds: string;
	ExtRuleDocs: Record<string, unknown>;
};

export type JSONRuleDefinition<
	Options extends Partial<JSONRuleDefinitionTypeOptions> = {},
> = RuleDefinition<
	// Language specific type options (non-configurable)
	{
		LangOptions: JSONLanguageOptions;
		Code: JSONSourceCode;
		Visitor: JSONRuleVisitor;
		Node: AnyNode;
	} & Required<
		// Rule specific type options (custom)
		Options &
			// Rule specific type options (defaults)
			Omit<JSONRuleDefinitionTypeOptions, keyof Options>
	>
>;
