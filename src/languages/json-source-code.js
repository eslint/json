/**
 * @fileoverview The JSONSourceCode class.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { iterator } from "@humanwhocodes/momoa";

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
/** @typedef {import("@eslint/core").TextSourceCode} TextSourceCode */
/** @typedef {import("@eslint/core").VisitTraversalStep} VisitTraversalStep */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * A class to represent a step in the traversal process.
 * @implements {VisitTraversalStep}
 */
class JSONTraversalStep {
	/**
	 * The type of the step.
	 * @type {"visit"}
	 * @readonly
	 */
	type = "visit";

	/**
	 * The kind of the step. Represents the same data as the `type` property
	 * but it's a number for performance.
	 * @type {1}
	 * @readonly
	 */
	kind = 1;

	/**
	 * The target of the step.
	 * @type {JSONNode}
	 */
	target;

	/**
	 * The phase of the step.
	 * @type {1|2}
	 */
	phase;

	/**
	 * The arguments of the step.
	 * @type {Array<any>}
	 */
	args;

	/**
	 * Creates a new instance.
	 * @param {Object} options The options for the step.
	 * @param {JSONNode} options.target The target of the step.
	 * @param {1|2} options.phase The phase of the step.
	 * @param {Array<any>} options.args The arguments of the step.
	 */
	constructor({ target, phase, args }) {
		this.target = target;
		this.phase = phase;
		this.args = args;
	}
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * JSON Source Code Object
 * @implements {TextSourceCode}
 */
export class JSONSourceCode {
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
	 * The lines of text in the source code.
	 * @type {Array<string>}
	 */
	#lines;

	/**
	 * The AST of the source code.
	 * @type {DocumentNode}
	 */
	ast;

	/**
	 * The text of the source code.
	 * @type {string}
	 */
	text;

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
		this.ast = ast;
		this.text = text;
		this.comments = ast.tokens.filter(token =>
			token.type.endsWith("Comment"),
		);
	}

	/* eslint-disable class-methods-use-this -- Required to complete interface. */

	/**
	 * Returns the loc information for the given node or token.
	 * @param {JSONNode|JSONToken} nodeOrToken The node or token to get the loc information for.
	 * @returns {SourceLocation} The loc information for the node or token.
	 */
	getLoc(nodeOrToken) {
		return nodeOrToken.loc;
	}

	/**
	 * Returns the range information for the given node or token.
	 * @param {JSONNode|JSONToken} nodeOrToken The node or token to get the range information for.
	 * @returns {SourceRange} The range information for the node or token.
	 */
	getRange(nodeOrToken) {
		return nodeOrToken.range;
	}

	/* eslint-enable class-methods-use-this -- Required to complete interface. */

	/**
	 * Returns the parent of the given node.
	 * @param {JSONNode} node The node to get the parent of.
	 * @returns {JSONNode|undefined} The parent of the node.
	 */
	getParent(node) {
		return this.#parents.get(node);
	}

	/**
	 * Gets all the ancestors of a given node
	 * @param {JSONNode} node The node
	 * @returns {Array<JSONNode>} All the ancestor nodes in the AST, not including the provided node, starting
	 * from the root node at index 0 and going inwards to the parent node.
	 * @throws {TypeError} When `node` is missing.
	 */
	getAncestors(node) {
		if (!node) {
			throw new TypeError("Missing required argument: node.");
		}

		const ancestorsStartingAtParent = [];

		for (
			let ancestor = this.#parents.get(node);
			ancestor;
			ancestor = this.#parents.get(ancestor)
		) {
			ancestorsStartingAtParent.push(ancestor);
		}

		return ancestorsStartingAtParent.reverse();
	}

	/**
	 * Gets the source code for the given node.
	 * @param {JSONNode} [node] The AST node to get the text for.
	 * @param {number} [beforeCount] The number of characters before the node to retrieve.
	 * @param {number} [afterCount] The number of characters after the node to retrieve.
	 * @returns {string} The text representing the AST node.
	 * @public
	 */
	getText(node, beforeCount, afterCount) {
		if (node) {
			return this.text.slice(
				Math.max(node.range[0] - (beforeCount || 0), 0),
				node.range[1] + (afterCount || 0),
			);
		}
		return this.text;
	}

	/**
	 * Gets the entire source text split into an array of lines.
	 * @returns {Array} The source text as an array of lines.
	 * @public
	 */
	get lines() {
		if (!this.#lines) {
			this.#lines = this.text.split(/\r?\n/gu);
		}
		return this.#lines;
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
			this.#parents.set(node, parent);
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
