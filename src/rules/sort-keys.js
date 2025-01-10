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

	create(context) {
		const [
			directionShort,
			{ allowLineSeparatedGroups, caseSensitive, natural, minKeys },
		] = context.options;

		const direction = directionShort === "asc" ? "ascending" : "descending";
		const sortName = natural ? "natural" : "alphanumeric";
		const sensitivity = caseSensitive ? "sensitive" : "insensitive";
		const isValidOrder = comparators[direction][sortName][sensitivity];

		const commentLines = new Set();
		for (const comment of context.sourceCode.comments) {
			commentLines.add(
				`${comment.loc.start.line}:${comment.loc.end.line}`,
			);
		}

		return {
			Object(node) {
				let prevMember;

				if (node.members.length < minKeys) {
					return;
				}

				for (const member of node.members) {
					const thisName = member.name.value;

					if (prevMember) {
						const prevName = prevMember?.name.value;
						const prevLine = prevMember?.loc.end.line;
						const thisLine = member.loc.start.line;

						const membersAreAdjacent =
							thisLine - prevLine < 2 ||
							commentLines.has(`${prevLine}:${thisLine}`) ||
							commentLines.has(`${prevLine + 1}:${thisLine}`) ||
							commentLines.has(`${prevLine}:${thisLine - 1}`) ||
							commentLines.has(`${prevLine + 1}:${thisLine - 1}`);

						if (
							(membersAreAdjacent ||
								allowLineSeparatedGroups === false) &&
							isValidOrder(prevName, thisName) === false
						) {
							context.report({
								node,
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
					}

					prevMember = member;
				}
			},
		};
	},
};
