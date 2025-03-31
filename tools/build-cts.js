/**
 * @fileoverview Rewrites import expressions for CommonJS compatibility.
 * This script creates "dist/cjs/index.d.cts" from "dist/esm/index.d.ts" by modifying imports
 * from `"./types.ts"` to `"./types.cts"`.
 *
 * Also updates "types.cts" to reference "index.cts"
 *
 * @author Francesco Trotta
 */

import { readFile, writeFile } from "node:fs/promises";

const oldSourceText = await readFile("dist/esm/index.d.ts", "utf-8");
const newSourceText = oldSourceText.replaceAll('"./types.ts"', '"./types.cts"');
await writeFile("dist/cjs/index.d.cts", newSourceText);

// Now update the types.cts to reference index.cts
const typesText = await readFile("dist/cjs/types.cts", "utf-8");
const updatedTypesText = typesText.replaceAll('"./index.js"', '"./index.cjs"');

await writeFile("dist/cjs/types.cts", updatedTypesText);
