import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FX_TOKENS_PATH = resolve("tokens/json/fx.tokens.json");

function resolveTokenRef(ref) {
	// Converts "{semantic.shadow-clr}" -> "var(--shadow-clr)"
	const inner = ref.replace(/^\{|\}$/g, "");
	const collections = ["semantic.component", "semantic", "core"];
	for (const col of collections) {
		if (inner.startsWith(col + ".")) {
			return `var(--${inner.slice(col.length + 1).replaceAll(".", "-")})`;
		}
	}
	return `var(--${inner.replaceAll(".", "-")})`;
}

function formatDimension(dim) {
	if (typeof dim === "string") return dim;
	if (typeof dim === "number") return dim === 0 ? "0" : `${dim}px`;
	const { value, unit } = dim;
	return value === 0 ? "0" : `${value}${unit}`;
}

function buildShadowValue(layers) {
	return layers
		.map(({ inset, color, offsetX, offsetY, blur, spread }) => {
			const colorValue = color.startsWith("{")
				? resolveTokenRef(color)
				: color;
			const parts = [offsetX, offsetY, blur, spread].map(formatDimension);
			parts.push(colorValue);
			if (inset) parts.unshift("inset");
			return parts.join(" ");
		})
		.join(", ");
}

export function generateShadowVars(css) {
	const fxTokens = JSON.parse(readFileSync(FX_TOKENS_PATH, "utf8"));
	const shadows = fxTokens?.fx?.shadow ?? {};
	const vars = Object.entries(shadows)
		.filter(([, token]) => token.$type === "shadow")
		.map(([name, token]) => {
			const varName = `--shadow-${name}`;
			const value = buildShadowValue(token.$value);
			return `  ${varName}: ${value};`;
		});

	if (vars.length === 0) return css;

	// Strip any previously injected shadow shorthand vars and the marker comment.
	const shadowVarNames = Object.keys(shadows).map((n) => `--shadow-${n}`);
	const stripPattern = new RegExp(
		`^  (?:/\\* shadow vars \\*/|(?:${shadowVarNames.map((v) => v.replace(/-/g, "\\-")).join("|")}):.*)\n`,
		"gm",
	);
	const cleaned = css.replace(stripPattern, "");

	// Inject before the first closing brace of :root.
	const marker = "  /* shadow vars */";
	const block = `${marker}\n${vars.join("\n")}`;
	return cleaned.replace(/(\n})(\n\n:root\.light)/, `\n${block}\n}$2`);
}
