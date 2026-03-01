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
 * @import { JSONRuleDefinition } from "../types.js";
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
 * @typedef {"ascending"|"descending"} DirectionName
 * @typedef {"alphanumeric"|"natural"} SortName
 * @typedef {"sensitive"|"insensitive"} Sensitivity
 * @typedef {Record<DirectionName, Record<SortName, Record<Sensitivity, Comparator>>>} ComparatorMap
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const hasNonWhitespace = /\S/u;

/** @type {ComparatorMap} */
const comparators = {
	ascending: {
		alphanumeric: {
			sensitive: (a, b) => a <= b,
			insensitive: (a, b) => a.toLowerCase() <= b.toLowerCase(),
		},
		natural: {
			sensitive: (a, b) => naturalCompare(a, b) <= 0,
			insensitive: (a, b) =>
				naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0,
		},
	},
	descending: {
		alphanumeric: {
			sensitive: (a, b) =>
				comparators.ascending.alphanumeric.sensitive(b, a),

			insensitive: (a, b) =>
				comparators.ascending.alphanumeric.insensitive(b, a),
		},
		natural: {
			sensitive: (a, b) => comparators.ascending.natural.sensitive(b, a),

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

		fixable: "code",

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

		/** @type {DirectionName} */
		const direction = directionShort === "asc" ? "ascending" : "descending";
		/** @type {SortName} */
		const sortName = natural ? "natural" : "alphanumeric";
		/** @type {Sensitivity} */
		const sensitivity = caseSensitive ? "sensitive" : "insensitive";
		/** @type {Comparator} */
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
				const hasUnsafeComments =
					sourceCode.comments.length > 0 &&
					sourceCode.comments.some(comment => {
						if (
							comment.range[0] < node.range[0] ||
							comment.range[1] > node.range[1]
						) {
							return false;
						}

						return !node.members.some(
							member =>
								comment.range[0] >= member.range[0] &&
								comment.range[1] <= member.range[1],
						);
					});

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
					const prevMemberNode = prevMember;

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
							fix(fixer) {
								if (hasUnsafeComments) {
									return null;
								}

								return [
									fixer.replaceText(
										member,
										sourceCode.getText(prevMemberNode),
									),
									fixer.replaceText(
										prevMemberNode,
										sourceCode.getText(member),
									),
								];
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
