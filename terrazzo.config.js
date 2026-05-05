import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";
import {
	stripCollectionPrefix,
	transformToken,
} from "./scripts/terrazzo-css-helpers.mjs";

export default defineConfig({
	tokens: [
		"./tokens/json/core.tokens.json",
		"./tokens/json/semantic.tokens.json",
	],
	outDir: "./tokens",
	plugins: [
		css({
			filename: "tokens.css",
			modeSelectors: [
				{
					mode: "dark",
					selectors: [":root.dark"],
				},
			],
			transform: transformToken,
			variableName(token) {
				return stripCollectionPrefix(token.id);
			},
		}),
	],
});
