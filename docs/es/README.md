---
original-commit: 723ddf4cc2593ce0469231a76f6dcf4dfb58c3e3
last-translation-date(yyyy-mm-dd): 2024-10-05 
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

- [English](https://github.com/eslint/json/blob/main/README.md)
- [Spanish](https://github.com/eslint/json/blob/main/docs/es/README.md)

## Licencia

Apache 2.0

## Patrocinadores

<!-- NOTA: Esta sección se genera automáticamente. No la edites manualmente.-->
<!--sponsorsstart-->
<!--sponsorsend-->

<!--techsponsorsstart-->
<!--techsponsorsend-->
