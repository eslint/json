# Changelog

## [1.0.1](https://github.com/eslint/json/compare/json-v1.0.0...json-v1.0.1) (2026-02-10)


### Bug Fixes

* update eslint ([#208](https://github.com/eslint/json/issues/208)) ([249ccda](https://github.com/eslint/json/commit/249ccda36767d3b508cfec615728d1b5bfde177a))

## [1.0.0](https://github.com/eslint/json/compare/json-v0.14.0...json-v1.0.0) (2026-01-28)


### ⚠ BREAKING CHANGES

* export types from main entry and remove `/types` export ([#198](https://github.com/eslint/json/issues/198))
* remove `rollup`, extraneous types and migrate to ESM-only ([#197](https://github.com/eslint/json/issues/197))
* Require Node.js ^20.19.0 || ^22.13.0 || >=24 ([#165](https://github.com/eslint/json/issues/165))

### Features

* export types from main entry and remove `/types` export ([#198](https://github.com/eslint/json/issues/198)) ([368c47b](https://github.com/eslint/json/commit/368c47beabfb14528e74e14afbc2917ee79b5bba))
* Require Node.js ^20.19.0 || ^22.13.0 || &gt;=24 ([#165](https://github.com/eslint/json/issues/165)) ([019fbcd](https://github.com/eslint/json/commit/019fbcd351d159a0c8ba10f58cbbe731069859fb))


### Bug Fixes

* add missing `name` property to `recommended` config ([#189](https://github.com/eslint/json/issues/189)) ([a3c26ca](https://github.com/eslint/json/commit/a3c26caccd210fa0762acff77fcb12d81c570b5a))
* display raw key in the message ([#179](https://github.com/eslint/json/issues/179)) ([3d63c38](https://github.com/eslint/json/commit/3d63c38fd2000418aceee64feb054b598a8a956a))
* program crashes in `no-unsafe-values` ([#194](https://github.com/eslint/json/issues/194)) ([8a536d2](https://github.com/eslint/json/commit/8a536d2ae1dbad4c3d589dbcdd88a6c472df0dae))
* remove `rollup`, extraneous types and migrate to ESM-only ([#197](https://github.com/eslint/json/issues/197)) ([55edfb9](https://github.com/eslint/json/commit/55edfb90cd8b2e892cbc5b7cd5a2f14fcbc0593f))
* update `@eslint/core` to `v1.0.0` and adjust tests ([#190](https://github.com/eslint/json/issues/190)) ([ba31cc2](https://github.com/eslint/json/commit/ba31cc20f241d20979573e4b1c01b7c418a71f69))
* update eslint ([#200](https://github.com/eslint/json/issues/200)) ([8d94c4a](https://github.com/eslint/json/commit/8d94c4ac54a1a09ec490bbcc5bec5fd91c3cf1d2))


### Miscellaneous Chores

* Bump version to 1.0.0 ([4f63024](https://github.com/eslint/json/commit/4f6302468d2c31686b5198da479b6fc1183dff95))

## [0.14.0](https://github.com/eslint/json/compare/json-v0.13.2...json-v0.14.0) (2025-11-04)


### Features

* add support for `getLocFromIndex` and `getIndexFromLoc` ([#109](https://github.com/eslint/json/issues/109)) ([3292cc1](https://github.com/eslint/json/commit/3292cc1fce03b3c4fc19fe3f45a85eddb9f46804))


### Bug Fixes

* correct the return type of `applyInlineConfig` ([#162](https://github.com/eslint/json/issues/162)) ([95c6238](https://github.com/eslint/json/commit/95c6238f90a0576b802fe1e41a85f3c660398da6))
* handle CR in `JSONSourceCode` ([#170](https://github.com/eslint/json/issues/170)) ([0f6cf86](https://github.com/eslint/json/commit/0f6cf86bcb602e77df33248b6c06f7d5ab011308))

## [0.13.2](https://github.com/eslint/json/compare/json-v0.13.1...json-v0.13.2) (2025-08-25)


### Bug Fixes

* allow any type for `meta.docs.recommended` in custom rules ([#132](https://github.com/eslint/json/issues/132)) ([d2c0d5a](https://github.com/eslint/json/commit/d2c0d5a98c54c61c626c4a3302d63227326d03c4))

## [0.13.1](https://github.com/eslint/json/compare/json-v0.13.0...json-v0.13.1) (2025-07-22)


### Bug Fixes

* bump `plugin-kit` to latest to resolve security vulnerabilities ([#125](https://github.com/eslint/json/issues/125)) ([5de1544](https://github.com/eslint/json/commit/5de154459feac158318e05ca871616c43c49b93c))

## [0.13.0](https://github.com/eslint/json/compare/json-v0.12.0...json-v0.13.0) (2025-07-11)


### Features

* add `url` and `recommended` field to existing rules ([#104](https://github.com/eslint/json/issues/104)) ([14bd26b](https://github.com/eslint/json/commit/14bd26b26b6eecfaf80daf78bab02a440632295e))
* Add token methods to JSONSourceCode ([#112](https://github.com/eslint/json/issues/112)) ([de3e150](https://github.com/eslint/json/commit/de3e150e0b5f9528c742af766f676ce3eb0e74e9))

## [0.12.0](https://github.com/eslint/json/compare/json-v0.11.0...json-v0.12.0) (2025-04-16)


### ⚠ BREAKING CHANGES

* Update package types for better reuse ([#91](https://github.com/eslint/json/issues/91))

### Features

* Update package types for better reuse ([#91](https://github.com/eslint/json/issues/91)) ([dce4601](https://github.com/eslint/json/commit/dce4601b1a40ceaeb4b61fbcbef0170a67b73e37))


### Bug Fixes

* Update `types.ts` for compatibility with `verbatimModuleSyntax` ([#88](https://github.com/eslint/json/issues/88)) ([d099c78](https://github.com/eslint/json/commit/d099c78318f8ca9a426d233717728304418425a1))

## [0.11.0](https://github.com/eslint/json/compare/json-v0.10.0...json-v0.11.0) (2025-03-14)


### Features

* Add `types` to exports ([#84](https://github.com/eslint/json/issues/84)) ([d9eab9e](https://github.com/eslint/json/commit/d9eab9ec3a733b561f55235eb71a611c7d84ebbb))


### Bug Fixes

* Update types and apply to all rules ([#86](https://github.com/eslint/json/issues/86)) ([10882ff](https://github.com/eslint/json/commit/10882ffe9c39cdd866be51801f9950f4a010cd87))
* Use updated types from @eslint/core ([#66](https://github.com/eslint/json/issues/66)) ([460e7c7](https://github.com/eslint/json/commit/460e7c707ed30fc41df280e40f300bafd5a3cae2))

## [0.10.0](https://github.com/eslint/json/compare/json-v0.9.1...json-v0.10.0) (2025-01-19)


### Features

* Add sort-keys rule ([#76](https://github.com/eslint/json/issues/76)) ([e68c247](https://github.com/eslint/json/commit/e68c247be11e1ea3fad20737f3e3672b855bc3ff))

## [0.9.1](https://github.com/eslint/json/compare/json-v0.9.0...json-v0.9.1) (2025-01-13)


### Bug Fixes

* make types usable in CommonJS ([#77](https://github.com/eslint/json/issues/77)) ([41ef891](https://github.com/eslint/json/commit/41ef89142ae40c6b5a4ee1c69d4db406ca5ef529))

## [0.9.0](https://github.com/eslint/json/compare/json-v0.8.0...json-v0.9.0) (2024-12-09)


### Features

* Add top-level-interop rule ([#69](https://github.com/eslint/json/issues/69)) ([af56d6c](https://github.com/eslint/json/commit/af56d6ce6bff9d073aedd7f07c3ec0248ec3b4e9))
* Catch more unsafe numbers ([#71](https://github.com/eslint/json/issues/71)) ([5ffc7c0](https://github.com/eslint/json/commit/5ffc7c0ead359c60a0cb5b2b4fdb522846933853))

## [0.8.0](https://github.com/eslint/json/compare/json-v0.7.0...json-v0.8.0) (2024-11-23)


### Features

* rule no-unnormalized-keys ([#63](https://github.com/eslint/json/issues/63)) ([c57882e](https://github.com/eslint/json/commit/c57882e1c3b51f00b94da4ed9b40d5cf2e4d6847))


### Bug Fixes

* add type tests ([#65](https://github.com/eslint/json/issues/65)) ([a6c0bc9](https://github.com/eslint/json/commit/a6c0bc9db1e265484c275860fdb41fcfd8aefaf2))
* expose `plugin.configs` in types ([#59](https://github.com/eslint/json/issues/59)) ([1fd0452](https://github.com/eslint/json/commit/1fd0452e97554ec4e696d2105f68df36fbe7f260))

## [0.7.0](https://github.com/eslint/json/compare/json-v0.6.0...json-v0.7.0) (2024-11-17)


### Features

* enable `no-unsafe-values` and add it to recommended configuration ([#51](https://github.com/eslint/json/issues/51)) ([72273f5](https://github.com/eslint/json/commit/72273f5dc0461505989a278a1f16b88d64bc8d7d))
* rule no-unsafe-values ([#30](https://github.com/eslint/json/issues/30)) ([6988e5c](https://github.com/eslint/json/commit/6988e5c1445bbca10b1988ca2d9949b4bc66378c))


### Bug Fixes

* Upgrade Momoa to fix parsing errors ([#50](https://github.com/eslint/json/issues/50)) ([3723a07](https://github.com/eslint/json/commit/3723a071a3bae296d2dbe66684b9d62832f099ad))

## [0.6.0](https://github.com/eslint/json/compare/json-v0.5.0...json-v0.6.0) (2024-10-31)


### Features

* Add allowTrailingCommas option for JSONC ([#42](https://github.com/eslint/json/issues/42)) ([c94953b](https://github.com/eslint/json/commit/c94953b702a1d9c0c48249f1bda727e2130841c8))

## [0.5.0](https://github.com/eslint/json/compare/json-v0.4.1...json-v0.5.0) (2024-10-02)


### Features

* Add support for config comments ([#27](https://github.com/eslint/json/issues/27)) ([723ddf4](https://github.com/eslint/json/commit/723ddf4cc2593ce0469231a76f6dcf4dfb58c3e3))

## [0.4.1](https://github.com/eslint/json/compare/json-v0.4.0...json-v0.4.1) (2024-09-09)


### Bug Fixes

* Don't require ESLint ([#25](https://github.com/eslint/json/issues/25)) ([dd112e1](https://github.com/eslint/json/commit/dd112e1ccf514a87a68d5068882ec7393aa6dd9b))

## [0.4.0](https://github.com/eslint/json/compare/json-v0.3.0...json-v0.4.0) (2024-08-20)


### Features

* Export internal constructs for other plugin authors ([#17](https://github.com/eslint/json/issues/17)) ([ad729f0](https://github.com/eslint/json/commit/ad729f0c60d42a84b2c87da52a6d2456b5211b48))

## [0.3.0](https://github.com/eslint/json/compare/json-v0.2.0...json-v0.3.0) (2024-07-25)


### Features

* Add JSON5 support ([#15](https://github.com/eslint/json/issues/15)) ([ea8dbb5](https://github.com/eslint/json/commit/ea8dbb53e1aa54dc9a6027393109c2988a3209f5))

## [0.2.0](https://github.com/eslint/json/compare/json-v0.1.0...json-v0.2.0) (2024-07-22)


### Features

* Add getLoc and getRange to JSONSourceCode ([#13](https://github.com/eslint/json/issues/13)) ([2225f63](https://github.com/eslint/json/commit/2225f630284b601d4cfc4ecc19148121d6e11a3f))
* Add meta info to plugin ([#12](https://github.com/eslint/json/issues/12)) ([f419757](https://github.com/eslint/json/commit/f419757b837fce5e37b29a2afe0b2885590ca8bd))

## [0.1.0](https://github.com/eslint/json/compare/json-v0.0.1...json-v0.1.0) (2024-07-06)


### Features

* Add JSON plugin ([#1](https://github.com/eslint/json/issues/1)) ([1976f2c](https://github.com/eslint/json/commit/1976f2c48b1da0cfba2d5ad2553f76182c147621))
* Add JSONLanguage#visitorKeys ([#4](https://github.com/eslint/json/issues/4)) ([d8afca4](https://github.com/eslint/json/commit/d8afca4fe72ae025c0acec523c0d6d9d9aaa5a49))


### Bug Fixes

* release-please (again) ([#7](https://github.com/eslint/json/issues/7)) ([5ef7c6c](https://github.com/eslint/json/commit/5ef7c6c642f92912328e20bb2cb6b055c302f034))
* Set initial release version in release-please-config.json ([#5](https://github.com/eslint/json/issues/5)) ([64f4db5](https://github.com/eslint/json/commit/64f4db5e68ab01be6acc9aad9b389bda256126a5))
