/**
 * @fileoverview Rule to require JSON object keys to be sorted. Copied largely from https://github.com/eslint/eslint/blob/main/lib/rules/sort-keys.js
 * @author Robin Thomas
 */

import naturalCompare from "natural-compare";

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

function getKey(member) {
	return member.name.type === `Identifier`
		? member.name.name
		: member.name.value;
}

export default {
	meta: {
		type: /** @type {const} */ ("suggestion"),

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
			description: `Require JSON object keys to be sorted`,
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

	/**
	 * Note that the comma after a member is *not* included in `member.loc`, therefore the comma position is irrelevant
	 */
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

		// Note that there can be comments *inside* members, e.g. `{"foo: /* comment *\/ "bar"}`, but these are ignored when calculating line-separated groups
		function isLineSeparated(prevMember, member) {
			const prevLine = prevMember.loc.end.line;
			const thisLine = member.loc.start.line;

			if (thisLine - prevLine < 2) {
				return false;
			}

			let lineNum = prevLine + 1;
			while (lineNum < thisLine) {
				if (!commentLineNums.has(lineNum)) {
					return true;
				}

				lineNum += 1;
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
