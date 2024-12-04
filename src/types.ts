/**
 * @fileoverview Additional types for this package.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import type {
	RuleVisitor,
	TextSourceCode,
	Language,
	LanguageOptions,
	RuleDefinition,
} from "@eslint/core";
import {
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

//------------------------------------------------------------------------------
// Types
//------------------------------------------------------------------------------

type ValueNodeParent = DocumentNode | MemberNode | ElementNode;

/**
 * A JSON syntax element, including nodes and tokens.
 */
export type JSONSyntaxElement = Token | AnyNode;

/**
 * Language options provided for JSON files.
 */
export interface JSONLanguageOptions extends LanguageOptions {
	/**
	 * Whether to allow trailing commas. Only valid in JSONC.
	 */
	allowTrailingCommas?: boolean;
}

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

/**
 * The `SourceCode` implementation for JSON files.
 */
export type IJSONSourceCode = TextSourceCode<{
	LangOptions: JSONLanguageOptions;
	RootNode: DocumentNode;
	SyntaxElementWithLoc: JSONSyntaxElement;
	ConfigNode: Token;
}>;

export type IJSONLanguage = Language<{
	LangOptions: JSONLanguageOptions;
	Code: IJSONSourceCode;
	RootNode: DocumentNode;
	Node: AnyNode;
}>;

export type JSONRuleDefinition<
	JSONRuleOptions extends unknown[],
	JSONRuleMessageIds extends string = "",
> = RuleDefinition<{
	LangOptions: JSONLanguageOptions;
	Code: IJSONSourceCode;
	RuleOptions: JSONRuleOptions;
	Visitor: JSONRuleVisitor;
	Node: AnyNode;
	MessageIds: JSONRuleMessageIds;
	ExtRuleDocs: {};
}>;
