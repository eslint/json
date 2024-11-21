/**
 * @filedescription Functions to fix up rules to provide missing methods on the `context` object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { parse } from "@humanwhocodes/momoa";
import { JSONSourceCode } from "./json-source-code.js";
import { visitorKeys } from "@humanwhocodes/momoa";

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------

/** @typedef {import("@humanwhocodes/momoa").DocumentNode} DocumentNode */
/** @typedef {import("@humanwhocodes/momoa").Node} JSONNode */
/** @typedef {import("@eslint/core").Language} Language */
/** @typedef {import("@eslint/core").OkParseResult<DocumentNode>} OkParseResult */
/** @typedef {import("@eslint/core").ParseResult<DocumentNode>} ParseResult */
/** @typedef {import("@eslint/core").File} File */
/** @typedef {import("../types.ts").IJSONLanguage} IJSONLanguage */
/** @typedef {import("../types.ts").JSONLanguageOptions} JSONLanguageOptions */

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * JSON Language Object
 * @implements {IJSONLanguage}
 */
export class JSONLanguage {
	/**
	 * The type of file to read.
	 * @type {"text"}
	 */
	fileType = "text";

	/**
	 * The line number at which the parser starts counting.
	 * @type {0|1}
	 */
	lineStart = 1;

	/**
	 * The column number at which the parser starts counting.
	 * @type {0|1}
	 */
	columnStart = 1;

	/**
	 * The name of the key that holds the type of the node.
	 * @type {string}
	 */
	nodeTypeKey = "type";

	/**
	 * The parser mode.
	 * @type {"json"|"jsonc"|"json5"}
	 */
	#mode = "json";

	/**
	 * The visitor keys.
	 * @type {Record<string, string[]>}
	 */
	visitorKeys = Object.fromEntries([...visitorKeys]);

	/**
	 * Creates a new instance.
	 * @param {Object} options The options to use for this instance.
	 * @param {"json"|"jsonc"|"json5"} options.mode The parser mode to use.
	 */
	constructor({ mode }) {
		this.#mode = mode;
	}

	/**
	 * Validates the language options.
	 * @param {JSONLanguageOptions} languageOptions The language options to validate.
	 * @returns {void}
	 * @throws {Error} When the language options are invalid.
	 */
	validateLanguageOptions(languageOptions) {
		if (languageOptions.allowTrailingCommas !== undefined) {
			if (typeof languageOptions.allowTrailingCommas !== "boolean") {
				throw new Error(
					"allowTrailingCommas must be a boolean if provided.",
				);
			}

			// we know that allowTrailingCommas is a boolean here

			// only allowed in JSONC mode
			if (this.#mode !== "jsonc") {
				throw new Error(
					"allowTrailingCommas option is only available in JSONC.",
				);
			}
		}
	}

	/**
	 * Parses the given file into an AST.
	 * @param {File} file The virtual file to parse.
	 * @param {{languageOptions: JSONLanguageOptions}} context The options to use for parsing.
	 * @returns {ParseResult} The result of parsing.
	 */
	parse(file, context) {
		// Note: BOM already removed
		const text = /** @type {string} */ (file.body);
		const allowTrailingCommas =
			context?.languageOptions?.allowTrailingCommas;

		/*
		 * Check for parsing errors first. If there's a parsing error, nothing
		 * else can happen. However, a parsing error does not throw an error
		 * from this method - it's just considered a fatal error message, a
		 * problem that ESLint identified just like any other.
		 */
		try {
			const root = parse(text, {
				mode: this.#mode,
				ranges: true,
				tokens: true,
				allowTrailingCommas,
			});

			return {
				ok: true,
				ast: root,
			};
		} catch (ex) {
			// error messages end with (line:column) so we strip that off for ESLint
			const message = ex.message
				.slice(0, ex.message.lastIndexOf("("))
				.trim();

			return {
				ok: false,
				errors: [
					{
						...ex,
						message,
					},
				],
			};
		}
	}

	/* eslint-disable class-methods-use-this -- Required to complete interface. */
	/**
	 * Creates a new `JSONSourceCode` object from the given information.
	 * @param {File} file The virtual file to create a `JSONSourceCode` object from.
	 * @param {OkParseResult} parseResult The result returned from `parse()`.
	 * @returns {JSONSourceCode} The new `JSONSourceCode` object.
	 */
	createSourceCode(file, parseResult) {
		return new JSONSourceCode({
			text: /** @type {string} */ (file.body),
			ast: parseResult.ast,
		});
	}
	/* eslint-enable class-methods-use-this -- Required to complete interface. */
}
