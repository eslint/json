/**
 * @fileoverview Additional types for this package.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import type { RuleVisitor } from "@eslint/core";
import type {
	CustomRuleDefinitionType,
	CustomRuleTypeDefinitions,
	CustomRuleVisitorWithExit,
} from "@eslint/plugin-kit";
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
export interface JSONRuleVisitor
	extends
		RuleVisitor,
		CustomRuleVisitorWithExit<{
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
