/**
 * @fileoverview Rule to require JSON object keys to be sorted.
 * Copied largely from https://github.com/eslint/eslint/blob/main/lib/rules/sort-keys.js
 * @author Robin Thomas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import naturalCompare from "natural-compare";

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @import { JSONRuleDefinition } from "../types.ts";
 * @import { MemberNode } from "@humanwhocodes/momoa";
 *
 * @typedef {Object} SortOptions
 * @property {boolean} caseSensitive
 * @property {boolean} natural
 * @property {number} minKeys
 * @property {boolean} allowLineSeparatedGroups
 *
 * @typedef {"sortKeys"} SortKeysMessageIds
 * @typedef {"asc"|"desc"} SortDirection
 * @typedef {[SortDirection, SortOptions]} SortKeysRuleOptions
 * @typedef {JSONRuleDefinition<{ RuleOptions: SortKeysRuleOptions, MessageIds: SortKeysMessageIds }>} SortKeysRuleDefinition
 * @typedef {(a:string,b:string) => boolean} Comparator
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const hasNonWhitespace = /\S/u;

const comparators = {
	ascending: {
		alphanumeric: {
			/** @type {Comparator} */
			sensitive: (a, b) => a <= b,

			/** @type {Comparator} */
			insensitive: (a, b) => a.toLowerCase() <= b.toLowerCase(),
		},
		natural: {
			/** @type {Comparator} */
			sensitive: (a, b) => naturalCompare(a, b) <= 0,

			/** @type {Comparator} */
			insensitive: (a, b) =>
				naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0,
		},
	},
	descending: {
		alphanumeric: {
			/** @type {Comparator} */
			sensitive: (a, b) =>
				comparators.ascending.alphanumeric.sensitive(b, a),

			/** @type {Comparator} */
			insensitive: (a, b) =>
				comparators.ascending.alphanumeric.insensitive(b, a),
		},
		natural: {
			/** @type {Comparator} */
			sensitive: (a, b) => comparators.ascending.natural.sensitive(b, a),

			/** @type {Comparator} */
			insensitive: (a, b) =>
				comparators.ascending.natural.insensitive(b, a),
		},
	},
};

/**
 * Gets the MemberNode's string key value.
 * @param {MemberNode} member
 * @return {string}
 */
function getKey(member) {
	return member.name.type === "Identifier"
		? member.name.name
		: member.name.value;
}

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

/** @type {SortKeysRuleDefinition} */
const rule = {
	meta: {
		type: "suggestion",

		defaultOptions: [
			"asc",
			{
				allowLineSeparatedGroups: false,
				caseSensitive: true,
				minKeys: 2,
				natural: false,
			},
		],

		docs: {
			recommended: false,
			description: `Require JSON object keys to be sorted`,
			url: "https://github.com/eslint/json#rules",
		},

		messages: {
			sortKeys:
				"Expected object keys to be in {{sortName}} case-{{sensitivity}} {{direction}} order. '{{thisName}}' should be before '{{prevName}}'.",
		},

		schema: [
			{
				enum: ["asc", "desc"],
			},
			{
				type: "object",
				properties: {
					caseSensitive: {
						type: "boolean",
					},
					natural: {
						type: "boolean",
					},
					minKeys: {
						type: "integer",
						minimum: 2,
					},
					allowLineSeparatedGroups: {
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],
	},

	create(context) {
		const [
			directionShort,
			{ allowLineSeparatedGroups, caseSensitive, natural, minKeys },
		] = context.options;

		const direction = directionShort === "asc" ? "ascending" : "descending";
		const sortName = natural ? "natural" : "alphanumeric";
		const sensitivity = caseSensitive ? "sensitive" : "insensitive";
		const isValidOrder = comparators[direction][sortName][sensitivity];

		// Note that @humanwhocodes/momoa doesn't include comments in the object.members tree, so we can't just see if a member is preceded by a comment
		const commentLineNums = new Set();
		for (const comment of context.sourceCode.comments) {
			for (
				let lineNum = comment.loc.start.line;
				lineNum <= comment.loc.end.line;
				lineNum += 1
			) {
				commentLineNums.add(lineNum);
			}
		}

		/**
		 * Checks if two members are line-separated.
		 * @param {MemberNode} prevMember The previous member.
		 * @param {MemberNode} member The current member.
		 * @return {boolean}
		 */
		function isLineSeparated(prevMember, member) {
			// Note that there can be comments *inside* members, e.g. `{"foo: /* comment *\/ "bar"}`, but these are ignored when calculating line-separated groups
			const prevMemberEndLine = prevMember.loc.end.line;
			const thisStartLine = member.loc.start.line;
			if (thisStartLine - prevMemberEndLine < 2) {
				return false;
			}

			for (
				let lineNum = prevMemberEndLine + 1;
				lineNum < thisStartLine;
				lineNum += 1
			) {
				if (
					!commentLineNums.has(lineNum) &&
					!hasNonWhitespace.test(
						context.sourceCode.lines[lineNum - 1],
					)
				) {
					return true;
				}
			}

			return false;
		}

		return {
			Object(node) {
				let prevMember;
				let prevName;

				if (node.members.length < minKeys) {
					return;
				}

				for (const member of node.members) {
					const thisName = getKey(member);

					if (
						prevMember &&
						!isValidOrder(prevName, thisName) &&
						(!allowLineSeparatedGroups ||
							!isLineSeparated(prevMember, member))
					) {
						context.report({
							loc: member.name.loc,
							messageId: "sortKeys",
							data: {
								thisName,
								prevName,
								direction,
								sensitivity,
								sortName,
							},
						});
					}

					prevMember = member;
					prevName = thisName;
				}
			},
		};
	},
};

export default rule;
