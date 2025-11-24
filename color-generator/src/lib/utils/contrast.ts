/**
 * WCAG contrast ratio calculations
 */

import { hexToRgb } from './colorConversion';

export function getRelativeLuminance(r: number, g: number, b: number): number {
	const [rs, gs, bs] = [r, g, b].map((c) => {
		c = c / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(hex1: string, hex2: string): number {
	const rgb1 = hexToRgb(hex1);
	const rgb2 = hexToRgb(hex2);
	if (!rgb1 || !rgb2) return 0;

	const l1 = getRelativeLuminance(rgb1.r * 255, rgb1.g * 255, rgb1.b * 255);
	const l2 = getRelativeLuminance(rgb2.r * 255, rgb2.g * 255, rgb2.b * 255);

	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);

	return (lighter + 0.05) / (darker + 0.05);
}
