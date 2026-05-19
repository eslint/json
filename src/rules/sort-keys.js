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
 * @typedef {"ascending"|"descending"} DirectionName
 * @typedef {"alphanumeric"|"natural"} SortName
 * @typedef {"sensitive"|"insensitive"} Sensitivity
 * @typedef {{ member: MemberNode, name: string, rawName: string, hasAdjacentComment: boolean, text: string }} MemberInfo
 * @typedef {{ members: MemberInfo[], sortedMembers: MemberInfo[] }} SegmentFixPlan
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const hasNonWhitespace = /\S/u;
const commentTypes = new Set(["LineComment", "BlockComment"]);

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

		/**
		 * Checks if a member has a comment before or after it.
		 * @param {MemberNode} member The member to check.
		 * @returns {boolean} True if a comment is adjacent to the member.
		 */
		function hasAdjacentComment(member) {
			const before = sourceCode.getTokenBefore(member, {
				includeComments: true,
			});
			let after = sourceCode.getTokenAfter(member, {
				includeComments: true,
			});

			if (after.type === "Comma") {
				after = sourceCode.getTokenAfter(after, {
					includeComments: true,
				});
			}

			return (
				commentTypes.has(before.type) || commentTypes.has(after.type)
			);
		}

		/**
		 * Compares two keys using the configured sort order.
		 * @param {string} a The first key.
		 * @param {string} b The second key.
		 * @returns {number} A negative number when `a` should come before `b`,
		 * a positive number when `a` should come after `b`, or 0 when they are equivalent.
		 */
		function compareKeys(a, b) {
			const left = caseSensitive ? a : a.toLowerCase();
			const right = caseSensitive ? b : b.toLowerCase();
			let comparison;

			if (natural) {
				comparison = naturalCompare(left, right);
			} else if (left === right) {
				comparison = 0;
			} else if (left < right) {
				comparison = -1;
			} else {
				comparison = 1;
			}

			return direction === "ascending" ? comparison : -comparison;
		}

		/**
		 * Determines whether two keys are already in the configured order.
		 * @param {string} a The previous key.
		 * @param {string} b The current key.
		 * @returns {boolean} True if the keys are already in the expected order.
		 */
		function isValidOrder(a, b) {
			return compareKeys(a, b) <= 0;
		}

		/**
		 * Creates metadata for a member that can be reused while checking and fixing an object.
		 * @param {MemberNode} member The member to describe.
		 * @returns {MemberInfo} The member metadata.
		 */
		function createMemberInfo(member) {
			return {
				member,
				name: getKey(member),
				rawName: getRawKey(member, sourceCode),
				hasAdjacentComment: hasAdjacentComment(member),
				text: sourceCode.getText(member),
			};
		}

		/**
		 * Builds fix plans for each movable segment inside a group.
		 * Members with adjacent comments are treated as barriers and are never moved.
		 * @param {MemberInfo[]} group The members in one sortable group.
		 * @returns {SegmentFixPlan[]} The fix plans for unsorted, comment-free segments.
		 */
		function getSegmentFixPlans(group) {
			/** @type {SegmentFixPlan[]} */
			const plans = [];
			/** @type {MemberInfo[]} */
			let segment = [];

			/**
			 * Finalizes the current segment if it contains movable members.
			 * @returns {void}
			 */
			function flushSegment() {
				if (segment.length > 1) {
					const sortedMembers = segment
						.map((memberInfo, index) => ({
							index,
							memberInfo,
						}))
						.sort((a, b) => {
							const result = compareKeys(
								a.memberInfo.name,
								b.memberInfo.name,
							);

							return result || a.index - b.index;
						})
						.map(({ memberInfo }) => memberInfo);

					if (
						sortedMembers.some(
							(memberInfo, index) =>
								memberInfo !== segment[index],
						)
					) {
						plans.push({
							members: segment,
							sortedMembers,
						});
					}
				}

				segment = [];
			}

			for (const memberInfo of group) {
				if (memberInfo.hasAdjacentComment) {
					flushSegment();
					continue;
				}

				segment.push(memberInfo);
			}

			flushSegment();

			return plans;
		}

		return {
			Object(node) {
				const memberInfos = node.members.map(createMemberInfo);

				if (memberInfos.length < minKeys) {
					return;
				}

				/** @type {MemberInfo[][]} */
				const groups = [];
				/** @type {MemberInfo[]} */
				let currentGroup = [];

				for (const memberInfo of memberInfos) {
					const prevMemberInfo = currentGroup.at(-1);

					if (
						prevMemberInfo &&
						allowLineSeparatedGroups &&
						isLineSeparated(
							prevMemberInfo.member,
							memberInfo.member,
						)
					) {
						groups.push(currentGroup);
						currentGroup = [];
					}

					currentGroup.push(memberInfo);
				}

				if (currentGroup.length > 0) {
					groups.push(currentGroup);
				}

				for (const group of groups) {
					const segmentFixPlans = getSegmentFixPlans(group);
					const segmentPlanByMember = new WeakMap(
						segmentFixPlans.flatMap(plan =>
							plan.members.map(memberInfo => [
								memberInfo.member,
								plan,
							]),
						),
					);
					let hasReportedFix = false;

					for (let index = 1; index < group.length; index += 1) {
						const prevMemberInfo = group[index - 1];
						const memberInfo = group[index];

						if (
							isValidOrder(prevMemberInfo.name, memberInfo.name)
						) {
							continue;
						}

						const data = {
							thisName: memberInfo.rawName,
							prevName: prevMemberInfo.rawName,
							direction,
							sensitivity,
							sortName,
						};
						const segmentPlan = segmentPlanByMember.get(
							memberInfo.member,
						);

						if (
							!hasReportedFix &&
							segmentPlan &&
							segmentPlan ===
								segmentPlanByMember.get(prevMemberInfo.member)
						) {
							context.report({
								loc: memberInfo.member.name.loc,
								messageId: "sortKeys",
								data,
								fix(fixer) {
									const fixes = [];

									for (const {
										members,
										sortedMembers,
									} of segmentFixPlans) {
										for (
											let memberIndex = 0;
											memberIndex < members.length;
											memberIndex += 1
										) {
											if (
												members[memberIndex] ===
												sortedMembers[memberIndex]
											) {
												continue;
											}

											fixes.push(
												fixer.replaceTextRange(
													members[memberIndex].member
														.range,
													sortedMembers[memberIndex]
														.text,
												),
											);
										}
									}

									return fixes;
								},
							});
							hasReportedFix = true;
							continue;
						}

						context.report({
							loc: memberInfo.member.name.loc,
							messageId: "sortKeys",
							data,
						});
					}
				}
			},
		};
	},
};

export default rule;
