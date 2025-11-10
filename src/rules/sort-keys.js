/**
 * @fileoverview Rule to require JSON object keys to be sorted.
 * Copied largely from https://github.com/eslint/eslint/blob/main/lib/rules/sort-keys.js
 * @author Robin Thomas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import naturalCompare from "natural-compare";
import { getKey, getRawKey } from "../util.js";

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @import { JSONRuleDefinition } from "../types.ts";
 * @import { MemberNode } from "@humanwhocodes/momoa";
 * @typedef {Object} SortOptions
 * @property {boolean} caseSensitive Whether key comparisons are case-sensitive.
 * @property {boolean} natural Whether to use natural sort order instead of purely alphanumeric.
 * @property {number} minKeys Minimum number of keys in an object before enforcing sorting.
 * @property {boolean} allowLineSeparatedGroups Whether a blank line between properties starts a new group that is independently sorted.
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
			/**
			 * Comparator for ascending alphanumeric order (case-sensitive).
			 * @type {Comparator}
			 */
			sensitive: (a, b) => a <= b,

			/**
			 * Comparator for ascending alphanumeric order (case-insensitive).
			 * @type {Comparator}
			 */
			insensitive: (a, b) => a.toLowerCase() <= b.toLowerCase(),
		},
		natural: {
			/**
			 * Comparator for ascending natural order (case-sensitive).
			 * @type {Comparator}
			 */
			sensitive: (a, b) => naturalCompare(a, b) <= 0,

			/**
			 * Comparator for ascending natural order (case-insensitive).
			 * @type {Comparator}
			 */
			insensitive: (a, b) =>
				naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0,
		},
	},
	descending: {
		alphanumeric: {
			/**
			 * Comparator for descending alphanumeric order (case-sensitive).
			 * @type {Comparator}
			 */
			sensitive: (a, b) =>
				comparators.ascending.alphanumeric.sensitive(b, a),

			/**
			 * Comparator for descending alphanumeric order (case-insensitive).
			 * @type {Comparator}
			 */
			insensitive: (a, b) =>
				comparators.ascending.alphanumeric.insensitive(b, a),
		},
		natural: {
			/**
			 * Comparator for descending natural order (case-sensitive).
			 * @type {Comparator}
			 */
			sensitive: (a, b) => comparators.ascending.natural.sensitive(b, a),

			/**
			 * Comparator for descending natural order (case-insensitive).
			 * @type {Comparator}
			 */
			insensitive: (a, b) =>
				comparators.ascending.natural.insensitive(b, a),
		},
	},
};

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
			url: "https://github.com/eslint/json/tree/main/docs/rules/sort-keys.md",
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
		const { sourceCode } = context;
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
		for (const comment of sourceCode.comments) {
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
		 * @returns {boolean} True if the members are separated by at least one blank line (ignoring comment-only lines).
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
					!hasNonWhitespace.test(sourceCode.lines[lineNum - 1])
				) {
					return true;
				}
			}

			return false;
		}

		return {
			Object(node) {
				/** @type {MemberNode} */
				let prevMember;
				/** @type {string} */
				let prevName;
				/** @type {string} */
				let prevRawName;

				if (node.members.length < minKeys) {
					return;
				}

				for (const member of node.members) {
					const thisName = getKey(member);
					const thisRawName = getRawKey(member, sourceCode);

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
								thisName: thisRawName,
								prevName: prevRawName,
								direction,
								sensitivity,
								sortName,
							},
						});
					}

					prevMember = member;
					prevName = thisName;
					prevRawName = thisRawName;
				}
			},
		};
	},
};

export default rule;
