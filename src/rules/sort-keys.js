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

		/**
		 * Compares two key names according to the rule options and returns a number
		 * suitable for Array.prototype.sort.
		 * @param {string} a First key to compare.
		 * @param {string} b Second key to compare.
		 * @returns {number} Negative if a < b, positive if a > b, 0 if equal.
		 */
		function compareKeys(a, b) {
			let a1 = a;
			let b1 = b;
			if (!caseSensitive) {
				a1 = a1.toLowerCase();
				b1 = b1.toLowerCase();
			}
			if (natural) {
				const r = naturalCompare(a1, b1);
				return directionShort === "asc" ? r : -r;
			}
			if (a1 < b1) {
				return directionShort === "asc" ? -1 : 1;
			}
			if (a1 > b1) {
				return directionShort === "asc" ? 1 : -1;
			}
			return 0;
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
							fix(fixer) {
								const text = context.sourceCode.text;

								// If there are any comment tokens within this object, do not attempt to autofix
								const hasComments =
									context.sourceCode.comments.some(
										comment =>
											comment.range[0] >= node.range[0] &&
											comment.range[1] <= node.range[1],
									);

								if (hasComments) {
									return null;
								}

								const groups = [];
								let groupStart = 0;
								for (let i = 1; i < node.members.length; i++) {
									if (
										allowLineSeparatedGroups &&
										isLineSeparated(
											node.members[i - 1],
											node.members[i],
										)
									) {
										groups.push({
											start: groupStart,
											end: i - 1,
										});
										groupStart = i;
									}
								}
								groups.push({
									start: groupStart,
									end: node.members.length - 1,
								});

								const fixes = [];
								for (const group of groups) {
									const groupLen =
										group.end - group.start + 1;
									if (groupLen <= 1) {
										continue;
									}

									let isSorted = true;
									for (
										let i = group.start + 1;
										i <= group.end;
										i++
									) {
										const prevKey = getKey(
											node.members[i - 1],
										);
										const thisKey = getKey(node.members[i]);
										if (compareKeys(prevKey, thisKey) > 0) {
											isSorted = false;
											break;
										}
									}
									if (isSorted) {
										continue;
									}

									const items = [];
									const seps = [];
									for (
										let i = group.start;
										i <= group.end;
										i++
									) {
										const m = node.members[i];
										items.push({
											key: getKey(m),
											start: m.range[0],
											end: m.range[1],
											text: text.slice(
												m.range[0],
												m.range[1],
											),
										});

										if (i < group.end) {
											seps.push(
												text.slice(
													node.members[i].range[1],
													node.members[i + 1]
														.range[0],
												),
											);
										}
									}

									const replaceStart = items[0].start;
									const replaceEnd = items.at(-1).end;

									const rebuilt = items
										.slice()
										.sort((a, b) =>
											compareKeys(a.key, b.key),
										)
										.map(
											(item, i) =>
												item.text +
												(i < seps.length
													? seps[i]
													: ""),
										)
										.join("");

									fixes.push(
										fixer.replaceTextRange(
											[replaceStart, replaceEnd],
											rebuilt,
										),
									);
								}

								return fixes;
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
