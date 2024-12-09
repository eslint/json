/**
 * @fileoverview The JSONSourceCode class.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { iterator } from "@humanwhocodes/momoa";
import {
	VisitNodeStep,
	TextSourceCodeBase,
	ConfigCommentParser,
	Directive,
} from "@eslint/plugin-kit";

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------

/** @typedef {import("@humanwhocodes/momoa").DocumentNode} DocumentNode */
/** @typedef {import("@humanwhocodes/momoa").Node} JSONNode */
/** @typedef {import("@humanwhocodes/momoa").Token} JSONToken */
/** @typedef {import("@eslint/core").SourceRange} SourceRange */
/** @typedef {import("@eslint/core").SourceLocation} SourceLocation */
/** @typedef {import("@eslint/core").File} File */
/** @typedef {import("@eslint/core").TraversalStep} TraversalStep */
/** @typedef {import("@eslint/core").VisitTraversalStep} VisitTraversalStep */
/** @typedef {import("@eslint/core").FileProblem} FileProblem */
/** @typedef {import("@eslint/core").DirectiveType} DirectiveType */
/** @typedef {import("@eslint/core").RulesConfig} RulesConfig */
/** @typedef {import("../types.ts").IJSONSourceCode} IJSONSourceCode */
/** @typedef {import("../types.ts").JSONSyntaxElement} JSONSyntaxElement */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const commentParser = new ConfigCommentParser();

const INLINE_CONFIG =
	/^\s*(?:eslint(?:-enable|-disable(?:(?:-next)?-line)?)?)(?:\s|$)/u;

/**
 * A class to represent a step in the traversal process.
 */
class JSONTraversalStep extends VisitNodeStep {
	/**
	 * The target of the step.
	 * @type {JSONNode}
	 */
	target = undefined;

	/**
	 * Creates a new instance.
	 * @param {Object} options The options for the step.
	 * @param {JSONNode} options.target The target of the step.
	 * @param {1|2} options.phase The phase of the step.
	 * @param {Array<any>} options.args The arguments of the step.
	 */
	constructor({ target, phase, args }) {
		super({ target, phase, args });

		this.target = target;
	}
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * JSON Source Code Object
 * @implements {IJSONSourceCode}
 */
export class JSONSourceCode extends TextSourceCodeBase {
	/**
	 * Cached traversal steps.
	 * @type {Array<JSONTraversalStep>|undefined}
	 */
	#steps;

	/**
	 * Cache of parent nodes.
	 * @type {WeakMap<JSONNode, JSONNode>}
	 */
	#parents = new WeakMap();

	/**
	 * Collection of inline configuration comments.
	 * @type {Array<JSONToken>}
	 */
	#inlineConfigComments;

	/**
	 * The AST of the source code.
	 * @type {DocumentNode}
	 */
	ast = undefined;

	/**
	 * The comment node in the source code.
	 * @type {Array<JSONToken>|undefined}
	 */
	comments;

	/**
	 * Creates a new instance.
	 * @param {Object} options The options for the instance.
	 * @param {string} options.text The source code text.
	 * @param {DocumentNode} options.ast The root AST node.
	 */
	constructor({ text, ast }) {
		super({ text, ast });
		this.ast = ast;
		this.comments = ast.tokens
			? ast.tokens.filter(token => token.type.endsWith("Comment"))
			: [];
	}

	/**
	 * Returns the value of the given comment.
	 * @param {JSONToken} comment The comment to get the value of.
	 * @returns {string} The value of the comment.
	 * @throws {Error} When an unexpected comment type is passed.
	 */
	#getCommentValue(comment) {
		if (comment.type === "LineComment") {
			return this.getText(comment).slice(2); // strip leading `//`
		}

		if (comment.type === "BlockComment") {
			return this.getText(comment).slice(2, -2); // strip leading `/*` and trailing `*/`
		}

		throw new Error(`Unexpected comment type '${comment.type}'`);
	}

	/**
	 * Returns an array of all inline configuration nodes found in the
	 * source code.
	 * @returns {Array<JSONToken>} An array of all inline configuration nodes.
	 */
	getInlineConfigNodes() {
		if (!this.#inlineConfigComments) {
			this.#inlineConfigComments = this.comments.filter(comment =>
				INLINE_CONFIG.test(this.#getCommentValue(comment)),
			);
		}

		return this.#inlineConfigComments ?? [];
	}

	/**
	 * Returns directives that enable or disable rules along with any problems
	 * encountered while parsing the directives.
	 * @returns {{problems:Array<FileProblem>,directives:Array<Directive>}} Information
	 *      that ESLint needs to further process the directives.
	 */
	getDisableDirectives() {
		const problems = [];
		const directives = [];

		this.getInlineConfigNodes().forEach(comment => {
			const { label, value, justification } =
				commentParser.parseDirective(this.#getCommentValue(comment));

			// `eslint-disable-line` directives are not allowed to span multiple lines as it would be confusing to which lines they apply
			if (
				label === "eslint-disable-line" &&
				comment.loc.start.line !== comment.loc.end.line
			) {
				const message = `${label} comment should not span multiple lines.`;

				problems.push({
					ruleId: null,
					message,
					loc: comment.loc,
				});
				return;
			}

			switch (label) {
				case "eslint-disable":
				case "eslint-enable":
				case "eslint-disable-next-line":
				case "eslint-disable-line": {
					const directiveType = label.slice("eslint-".length);

					directives.push(
						new Directive({
							type: /** @type {DirectiveType} */ (directiveType),
							node: comment,
							value,
							justification,
						}),
					);
				}

				// no default
			}
		});

		return { problems, directives };
	}

	/**
	 * Returns inline rule configurations along with any problems
	 * encountered while parsing the configurations.
	 * @returns {{problems:Array<FileProblem>,configs:Array<{config:{rules:RulesConfig},loc:SourceLocation}>}} Information
	 *      that ESLint needs to further process the rule configurations.
	 */
	applyInlineConfig() {
		const problems = [];
		const configs = [];

		this.getInlineConfigNodes().forEach(comment => {
			const { label, value } = commentParser.parseDirective(
				this.#getCommentValue(comment),
			);

			if (label === "eslint") {
				const parseResult = commentParser.parseJSONLikeConfig(value);

				if (parseResult.ok) {
					configs.push({
						config: {
							rules: parseResult.config,
						},
						loc: comment.loc,
					});
				} else {
					problems.push({
						ruleId: null,
						message:
							/** @type {{ok: false, error: { message: string }}} */ (
								parseResult
							).error.message,
						loc: comment.loc,
					});
				}
			}
		});

		return {
			configs,
			problems,
		};
	}

	/**
	 * Returns the parent of the given node.
	 * @param {JSONNode} node The node to get the parent of.
	 * @returns {JSONNode|undefined} The parent of the node.
	 */
	getParent(node) {
		return this.#parents.get(node);
	}

	/**
	 * Traverse the source code and return the steps that were taken.
	 * @returns {Iterable<JSONTraversalStep>} The steps that were taken while traversing the source code.
	 */
	traverse() {
		// Because the AST doesn't mutate, we can cache the steps
		if (this.#steps) {
			return this.#steps.values();
		}

		/** @type {Array<JSONTraversalStep>} */
		const steps = (this.#steps = []);

		for (const { node, parent, phase } of iterator(this.ast)) {
			if (parent) {
				this.#parents.set(node, parent);
			}

			steps.push(
				new JSONTraversalStep({
					target: node,
					phase: phase === "enter" ? 1 : 2,
					args: [node, parent],
				}),
			);
		}

		return steps;
	}
}
