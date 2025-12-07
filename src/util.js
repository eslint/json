/**
 * @fileoverview Utility Library
 * @author 루밀LuMir(lumirlumir)
 */

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @import { MemberNode } from "@humanwhocodes/momoa";
 * @import { JSONSourceCode } from "./languages/json-source-code.js";
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Gets the `MemberNode`'s key value.
 * @param {MemberNode} node The node to get the key from.
 * @returns {string} The key value.
 */
export function getKey(node) {
	return node.name.type === "String" ? node.name.value : node.name.name;
}

/**
 * Gets the `MemberNode`'s raw key value.
 * @param {MemberNode} node The node to get the raw key from.
 * @param {JSONSourceCode} sourceCode The JSON source code object.
 * @returns {string} The raw key value.
 */
export function getRawKey(node, sourceCode) {
	return node.name.type === "String"
		? sourceCode.getText(node.name, -1, -1)
		: sourceCode.getText(node.name);
}
