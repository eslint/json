/**
 * @fileoverview The JSONSourceCode class.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { iterator } from "@humanwhocodes/momoa";
import { VisitNodeStep, TextSourceCodeBase } from "@eslint/plugin-kit";

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
