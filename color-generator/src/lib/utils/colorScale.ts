/**
 * Color scale generation utilities
 */

import { hslToRgb, rgbToHex } from "./colorConversion";
import type { ColorScale, Shade } from "../types/color";

// Lightness mapping from original palette (perceptually adjusted)
export const lightnessMap: Record<number, number> = {
	100: 1.0,
	95: 0.97,
	90: 0.95,
	80: 0.91,
	70: 0.84,
	60: 0.68,
	50: 0.42,
	40: 0.36,
	30: 0.3,
	20: 0.2,
	10: 0.14,
	5: 0.08,
	0: 0.04,
};

export function generateScale(
	scales: ColorScale[],
	shades: Shade[],
	scaleSaturations: Record<string, number>,
	scaleHues: Record<string, number | null>,
	baseHue: number,
): Record<string, Record<number, string>> {
	const result: Record<string, Record<number, string>> = {};

	for (const scale of scales) {
		const scaleHue =
			scaleHues[scale.id] !== null
				? scaleHues[scale.id]!
				: scale.baseHue || baseHue;
		result[scale.id] = {};

		const baseSaturation = scaleSaturations[scale.id] / 100;

		for (const shade of shades) {
			const lightness = lightnessMap[shade.value];
			const saturation = baseSaturation;

			const rgb = hslToRgb(scaleHue, saturation, lightness);
			result[scale.id][shade.value] = rgbToHex(rgb.r, rgb.g, rgb.b);
		}
	}

	return result;
}
