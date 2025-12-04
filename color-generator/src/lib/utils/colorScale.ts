/**
 * Color scale generation utilities with perceptual easing
 *
 * The scale is divided into 4 semantic zones:
 * - Background (100-80): Subtle backgrounds, nearly white/black
 * - Soft (70-50): Interactive elements, borders, muted colors
 * - Solid (40-20): Primary interactive elements, buttons, strong accents
 * - Text (10-0): High contrast text, icons
 */

import { hslToRgb, rgbToHex } from "./colorConversion";
import type { ColorScale, Shade } from "../types/color";

// Semantic zone definitions
export const ZONES = {
	background: { range: [100, 80], description: "Subtle backgrounds" },
	soft: { range: [70, 50], description: "Borders, muted UI" },
	solid: { range: [40, 20], description: "Buttons, accents" },
	text: { range: [10, 0], description: "Text, icons" },
} as const;

/**
 * Calculate perceptual brightness adjustment based on hue
 * Different hues are perceived as having different brightness even at the same lightness
 * This adjusts lightness to compensate for human color perception
 * Green (120°) is perceived as brightest, Blue/Purple (240°) as darkest
 */
function getHueLightnessAdjustment(hue: number, shade: number): number {
	// Only apply adjustment to darker shades (0-30) where perception difference is most noticeable
	if (shade > 30) return 0;

	// Normalize hue to 0-360
	hue = hue % 360;
	if (hue < 0) hue += 360;

	// Calculate base adjustment using a sine wave peaking at yellow-green (120°)
	// and lowest at blue-purple (240°)
	const hueFactor = Math.sin(((hue - 240) * Math.PI) / 180);

	// Scale adjustment based on how dark the shade is
	// Darker shades need more correction
	const shadeFactor = (50 - shade) / 30;

	// Apply adjustment: purple/blue get boosted, green/yellow stay neutral
	// Maximum adjustment is about +0.04 (4%) for very dark purples
	return hueFactor * 0.04 * shadeFactor;
}

/**
 * Perceptual easing function for lightness
 * Uses a power curve to match human perception
 * - Upper range (background): Linear to preserve subtle distinctions
 * - Middle range (soft/solid): Exponential for smoother transitions
 * - Lower range (text): Compressed for better contrast
 *
 * @param shade - The shade value (0-100)
 * @param shade50Target - Optional custom lightness for shade 50 (0-1), which scales adjacent shades
 * @param isNeutral - Whether this is the neutral color scale (uses original lightness values)
 */
function calculateLightness(
	shade: number,
	shade50Target?: number,
	isNeutral: boolean = false,
): number {
	const t = shade / 100; // Normalize to 0-1

	if (shade >= 80) {
		// Background zone: darker for colored scales, original for neutral
		if (isNeutral) {
			return 0.9 + (t - 0.8) * 0.5; // Maps 80-100 to 0.91-1.0 (original)
		} else {
			return 0.9 + (t - 0.8) * 0.42; // Maps 80-100 to 0.88-0.98 (slightly darker)
		}
	} else if (shade >= 50) {
		// Soft zone: power curve for perceptual evenness
		const zoneT = (t - 0.5) / 0.3; // Normalize within zone
		const baseLightness = 0.43 + Math.pow(zoneT, 0.7) * 0.48; // Maps 50-80 to 0.43-0.91

		// If custom shade 50 target is provided, scale this zone proportionally
		if (shade50Target !== undefined && shade === 50) {
			return shade50Target;
		} else if (shade50Target !== undefined) {
			// Scale the zone based on the difference from default shade 50
			const shade50Base = 0.4;
			const shade50Adjustment = shade50Target - shade50Base;
			// Apply adjustment with distance-based falloff
			const distanceFromShade50 = Math.abs(shade - 50) / 30; // 30 = distance to shade 80
			const adjustmentFactor = Math.pow(1.4 - distanceFromShade50, 1.5);
			return baseLightness + shade50Adjustment * adjustmentFactor;
		}

		return baseLightness;
	} else if (shade >= 20) {
		// Solid zone: linear for predictable interactive colors
		// Increased lightness range for more brightness and contrast (22%-48% instead of 19%-43%)
		const zoneT = (t - 0.2) / 0.3;
		const baseLightness = 0.22 + zoneT * 0.26; // Maps 20-50 to 0.22-0.48

		// Scale based on shade 50 adjustment
		if (shade50Target !== undefined && shade === 50) {
			return shade50Target;
		} else if (shade50Target !== undefined) {
			const shade50Base = 0.48;
			const shade50Adjustment = shade50Target - shade50Base;
			// Apply adjustment with distance-based falloff
			const distanceFromShade50 = Math.abs(shade - 50) / 30; // 30 = distance to shade 20
			const adjustmentFactor = Math.pow(1 - distanceFromShade50, 1.5);
			return baseLightness + shade50Adjustment * adjustmentFactor;
		}
		return baseLightness;
	} else {
		// Text zone: increased contrast between shades for better differentiation
		const zoneT = t / 0.2;
		if (isNeutral) {
			// Neutral: expanded range for better contrast (8%-22% instead of 9%-19%)
			return 0.08 + Math.pow(zoneT, 0.85) * 0.14; // Maps 0-20 to 0.08-0.22
		} else {
			// Colored: expanded range for better contrast (11%-26% instead of 12%-24%)
			return 0.11 + Math.pow(zoneT, 0.85) * 0.15; // Maps 0-20 to 0.11-0.26
		}
	}
}

// Generate the lightness map using the mathematical function
export const lightnessMap: Record<number, number> = {
	100: calculateLightness(100),
	95: calculateLightness(95),
	90: calculateLightness(90),
	80: calculateLightness(80),
	70: calculateLightness(70),
	60: calculateLightness(60),
	50: calculateLightness(50),
	40: calculateLightness(40),
	30: calculateLightness(30),
	20: calculateLightness(20),
	10: calculateLightness(10),
	5: calculateLightness(5),
	0: calculateLightness(0),
};

/**
 * Get the semantic zone for a given shade value
 */
export function getSemanticZone(shade: number): keyof typeof ZONES {
	if (shade >= 80) return "background";
	if (shade >= 50) return "soft";
	if (shade >= 20) return "solid";
	return "text";
}

export function generateScale(
	scales: ColorScale[],
	shades: Shade[],
	scaleSaturations: Record<string, number>,
	scaleHues: Record<string, number | null>,
	baseHue: number,
	scaleShade50Lightness: Record<string, number>,
): Record<string, Record<number, string>> {
	const result: Record<string, Record<number, string>> = {};

	for (const scale of scales) {
		const scaleHue =
			scaleHues[scale.id] !== null
				? scaleHues[scale.id]!
				: scale.baseHue || baseHue;
		result[scale.id] = {};

		const baseSaturation = scaleSaturations[scale.id] / 100;
		const shade50Lightness = scaleShade50Lightness[scale.id] / 100;

		for (const shade of shades) {
			// Calculate lightness with shade 50 adjustment affecting neighboring shades
			const isNeutral = scale.id === "ntrl";
			let lightness = calculateLightness(
				shade.value,
				shade50Lightness,
				isNeutral,
			);

			// Apply perceptual brightness adjustment based on hue
			if (!isNeutral) {
				lightness += getHueLightnessAdjustment(scaleHue, shade.value);
			}

			// Reduce saturation for lighter shades (100-60) to create softer backgrounds
			let saturation = baseSaturation;
			if (shade.value >= 60) {
				// Linear reduction: 20% at shade 100, 10% at shade 60
				const desaturationFactor =
					0.15 - ((shade.value - 60) / 40) * 0.1;
				saturation = baseSaturation * (1 - desaturationFactor);
			}

			const rgb = hslToRgb(scaleHue, saturation, lightness);
			result[scale.id][shade.value] = rgbToHex(rgb.r, rgb.g, rgb.b);
		}
	}

	return result;
}
