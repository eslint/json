---
translated-from-English-original-commit: cac8847d651eaf4bf945c89480c7d12c9cf0ad12
last-translation-date(yyyy-mm-dd): 2024-10-06
---

# Complemento de lenguaje JSON de ESLint

## Descripción general

Este paquete contiene un complemento que le permite analizar de forma nativa archivos JSON y JSONC mediante ESLint.

**Importante:** Este complemento requiere ESLint v9.6.0 o superior y debe utilizar el [nuevo sistema de configuración](https://eslint.org/docs/latest/use/configure/configuration-files).

## Instalación

Para Node.js y entornos de ejecución compatibles:

```shell
npm install @eslint/json -D
# or
yarn add @eslint/json -D
# or
pnpm install @eslint/json -D
# or
bun install @eslint/json -D
```

Para Deno:

```shell
deno add @eslint/json
```

## Uso

Este paquete exporta estos idiomas:

-   `"json/json"` es para archivos JSON normales
-   `"json/jsonc"` es para archivos JSON que soportan comentarios ([JSONC](https://github.com/microsoft/node-jsonc-parser)) como los que se utilizan para los archivos de configuración de Visual Studio Code
-   `"json/json5"` es para archivos [JSON5](https://json5.org)

Dependiendo de los tipos de archivos JSON que desee analizar, puede configurar su archivo `eslint.config.js` para que incluya solo los archivos que desee. Aquí hay un ejemplo que analiza archivos JSON, JSONC y JSON5:

```js
import json from "@eslint/json";

export default [
	{
		plugins: {
			json,
		},
	},

	// lint archivos JSON
	{
		files: ["**/*.json"],
		language: "json/json",
		rules: {
			"json/no-duplicate-keys": "error",
		},
	},

	// lint archivos JSONC
	{
		files: ["**/*.jsonc", ".vscode/*.json"],
		language: "json/jsonc",
		rules: {
			"json/no-duplicate-keys": "error",
		},
	},

	// lint archivos JSON5
	{
		files: ["**/*.json5"],
		language: "json/json5",
		rules: {
			"json/no-duplicate-keys": "error",
		},
	},
];
```

En formato CommonJS:

```js
const json = require("@eslint/json").default;

module.exports = [
	{
		plugins: {
			json,
		},
	},

	// lint archivos JSON
	{
		files: ["**/*.json"],
		language: "json/json",
		rules: {
			"json/no-duplicate-keys": "error",
		},
	},

	// lint archivos JSONC
	{
		files: ["**/*.jsonc", ".vscode/*.json"],
		language: "json/jsonc",
		rules: {
			"json/no-duplicate-keys": "error",
		},
	},

	// lint archivos JSON5
	{
		files: ["**/*.json5"],
		language: "json/json5",
		rules: {
			"json/no-duplicate-keys": "error",
		},
	},
];
```

## Configuración Recomendada

Para utilizar la configuración recomendada para este complemento, especifique los `archivos` correspondientes y luego use el objeto `json.configs.recommended`, de la siguiente manera:

```js
import json from "@eslint/json";

export default [
	// lint archivos JSON
	{
		files: ["**/*.json"],
		ignores: ["package-lock.json"],
		language: "json/json",
		...json.configs.recommended,
	},

	// lint archivos JSONC
	{
		files: ["**/*.jsonc"],
		language: "json/jsonc",
		...json.configs.recommended,
	},

	// lint archivos JSON5
	{
		files: ["**/*.json5"],
		language: "json/json5",
		...json.configs.recommended,
	},
];
```

**Nota:** Generalmente es mejor ignorar `package-lock.json` porque se genera automáticamente y normalmente no es recomendable realizar cambios en él manualmente.

## Reglas

-   `no-duplicate-keys` - warns/advierte cuando hay dos claves en un objeto con el mismo texto.
-   `no-empty-keys` - warns/advierte cuando hay una clave en un objeto que es una cadena vacía o contiene solo espacios en blanco (nota: `package-lock.json` usa claves vacías intencionalmente)

## Comentarios de configuración

En los archivos JSONC y JSON5, también puede usar [comentarios de configuración de reglas](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments) y [directivas de desactivación](https://eslint.org/docs/latest/use/configure/rules#disabling-rules).

```jsonc
/* eslint json/no-empty-keys: "error" */

{
	"foo": {
		"": 1, // eslint-disable-line json/no-empty-keys -- Aquí queremos una clave vacía
	},
	"bar": {
		// eslint-disable-next-line json/no-empty-keys -- Aquí también queremos una clave vacía
		"": 2,
	},
	/* eslint-disable json/no-empty-keys -- También se permiten claves vacías en el siguiente código */
	"baz": [
		{
			"": 3,
		},
		{
			"": 4,
		},
	],
	/* eslint-enable json/no-empty-keys -- volver a habilitar ahora */
}
```

Se pueden utilizar comentarios de línea y de bloque para todo tipo de comentarios de configuración.

## Preguntas frecuentes

### ¿Cómo se relaciona esto con `eslint-plugin-json` y `eslint-plugin-jsonc`?

Este complemento implementa el análisis de JSON para ESLint mediante la API de complementos de lenguaje, que es la forma oficial de admitir lenguajes que no sean JavaScript en ESLint. Esto difiere de los otros complementos:

-   `eslint-plugin-json` usa un procesador para analizar el JSON, lo que significa que no crea un AST y no puedes escribir reglas personalizadas para él.
-   `eslint-plugin-jsonc` usa un analizador que aún pasa por la funcionalidad de linting de JavaScript y requiere varias reglas para rechazar la sintaxis de JavaScript válida que no es válida en JSON.

Como tal, este complemento es más sólido y rápido que los demás. También puedes escribir tus propias reglas personalizadas cuando uses los lenguajes en este complemento.

### ¿Qué sucede con las reglas faltantes que están disponibles en `eslint-plugin-json` y `eslint-plugin-jsonc`?

La mayoría de las reglas de `eslint-plugin-json` son, en realidad, errores de sintaxis que el analizador utilizado en este complemento detecta automáticamente.

De manera similar, muchas de las reglas de `eslint-plugin-jsonc` prohíben específicamente la sintaxis de JavaScript válida que no es válida en el contexto de JSON. El analizador de este complemento también las detecta automáticamente.

Se aceptan otras reglas que detecten posibles problemas en JSON. Puede [abrir un problema](https://github.com/eslint/json/issues/new/choose) para proponer una nueva regla.

## Translations

-   [English](https://github.com/eslint/json/blob/main/README.md)
-   [Spanish](https://github.com/eslint/json/blob/main/docs/es/README.md)

## Licencia

Apache 2.0

<!-- NOTE: Esta sección se genera automáticamente. No la edites manualmente. -->
<!--sponsorsstart-->

## Patrocinadores

para que su logotipo aparezca en nuestros archivos README y en nuestro [sitio web](https://eslint.org/sponsors).

<h3>Patrocinadores Platino</h3>
<p><a href="https://automattic.com"><img src="https://images.opencollective.com/automattic/d0ef3e1/logo.png" alt="Automattic" height="128"></a> <a href="https://www.airbnb.com/"><img src="https://images.opencollective.com/airbnb/d327d66/logo.png" alt="Airbnb" height="128"></a></p><h3>Patrocinadores Oro</h3>
<p><a href="https://trunk.io/"><img src="https://images.opencollective.com/trunkio/fb92d60/avatar.png" alt="trunk.io" height="96"></a></p><h3>Patrocinadores Plata</h3>
<p><a href="https://www.jetbrains.com/"><img src="https://images.opencollective.com/jetbrains/fe76f99/logo.png" alt="JetBrains" height="64"></a> <a href="https://liftoff.io/"><img src="https://images.opencollective.com/liftoff/5c4fa84/logo.png" alt="Liftoff" height="64"></a> <a href="https://americanexpress.io"><img src="https://avatars.githubusercontent.com/u/3853301?v=4" alt="American Express" height="64"></a> <a href="https://www.workleap.com"><img src="https://avatars.githubusercontent.com/u/53535748?u=d1e55d7661d724bf2281c1bfd33cb8f99fe2465f&v=4" alt="Workleap" height="64"></a></p><h3>Patrocinadores Bronce</h3>
<p><a href="https://www.wordhint.net/"><img src="https://images.opencollective.com/wordhint/be86813/avatar.png" alt="WordHint" height="32"></a> <a href="https://www.crosswordsolver.org/anagram-solver/"><img src="https://images.opencollective.com/anagram-solver/2666271/logo.png" alt="Anagram Solver" height="32"></a> <a href="https://icons8.com/"><img src="https://images.opencollective.com/icons8/7fa1641/logo.png" alt="Icons8" height="32"></a> <a href="https://discord.com"><img src="https://images.opencollective.com/discordapp/f9645d9/logo.png" alt="Discord" height="32"></a> <a href="https://www.gitbook.com"><img src="https://avatars.githubusercontent.com/u/7111340?v=4" alt="GitBook" height="32"></a> <a href="https://nx.dev"><img src="https://avatars.githubusercontent.com/u/23692104?v=4" alt="Nx" height="32"></a> <a href="https://herocoders.com"><img src="https://avatars.githubusercontent.com/u/37549774?v=4" alt="HeroCoders" height="32"></a> <a href="https://usenextbase.com"><img src="https://avatars.githubusercontent.com/u/145838380?v=4" alt="Nextbase Starter Kit" height="32"></a></p>
<h3>Patrocinadores tecnológicos</h3>
Los patrocinadores tecnológicos nos permiten utilizar sus productos y servicios de forma gratuita como parte de una contribución al ecosistema de código abierto y a nuestro trabajo.
<p><a href="https://netlify.com"><img src="https://raw.githubusercontent.com/eslint/eslint.org/main/src/assets/images/techsponsors/netlify-icon.svg" alt="Netlify" height="32"></a> <a href="https://algolia.com"><img src="https://raw.githubusercontent.com/eslint/eslint.org/main/src/assets/images/techsponsors/algolia-icon.svg" alt="Algolia" height="32"></a> <a href="https://1password.com"><img src="https://raw.githubusercontent.com/eslint/eslint.org/main/src/assets/images/techsponsors/1password-icon.svg" alt="1Password" height="32"></a></p>
<!--sponsorsend-->
