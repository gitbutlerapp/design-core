<script lang="ts">
	import { hexToRgb, rgbToHsl } from "./utils/colorConversion";
	import { generateScale } from "./utils/colorScale";
	import { copyToClipboard } from "./utils/export";
	import {
		SCALES,
		SHADES,
		DEFAULT_SATURATIONS,
		DEFAULT_SHADE_50_LIGHTNESS,
	} from "./constants/colorScales";
	import SemanticZones from "./components/SemanticZones.svelte";
	import ColorScaleDisplay from "./components/ColorScaleDisplay.svelte";
	import ExportSection from "./components/ExportSection.svelte";

	let scaleSaturations: Record<string, number> = $state({
		...DEFAULT_SATURATIONS,
	});
	let scaleHues: Record<string, number | null> = $state({
		ntrl: null,
		pop: null,
		err: null,
		warn: null,
		succ: null,
		purp: null,
	});
	let scaleShade50Lightness: Record<string, number> = $state({
		...DEFAULT_SHADE_50_LIGHTNESS,
	});

	const baseHue = 180;

	// Generate colors reactively whenever dependencies change
	let currentColors = $derived(
		generateScale(
			SCALES,
			SHADES,
			scaleSaturations,
			scaleHues,
			baseHue,
			scaleShade50Lightness,
		),
	);

	function updateScaleHue(scaleId: string, hexColor: string) {
		const rgb = hexToRgb(hexColor);
		if (!rgb) return;
		const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
		scaleHues[scaleId] = hsl.h;
	}

	function updateScaleSaturation(scaleId: string, value: number) {
		scaleSaturations[scaleId] = value;
	}

	function updateScaleShade50Lightness(scaleId: string, value: number) {
		scaleShade50Lightness[scaleId] = value;
	}

	function copyScaleJSON(scaleId: string) {
		const json = JSON.stringify(currentColors[scaleId], null, 2);
		copyToClipboard(json);
	}
</script>

<div class="container">
	<h1>🎨 GitButler Color Scale Generator</h1>
	<p class="subtitle">
		HSL-based color scale with semantic zones and individual palette
		controls
	</p>

	<SemanticZones />

	<div id="scalesContainer">
		{#each SCALES as scale (scale.id)}
			<ColorScaleDisplay
				{scale}
				shades={SHADES}
				colors={currentColors[scale.id] || {}}
				bind:saturation={scaleSaturations[scale.id]}
				bind:shade50Lightness={scaleShade50Lightness[scale.id]}
				hue={scaleHues[scale.id]}
				onHueChange={updateScaleHue}
				onSaturationChange={updateScaleSaturation}
				onShade50LightnessChange={updateScaleShade50Lightness}
				onCopyJSON={copyScaleJSON}
			/>
		{/each}
	</div>

	<ExportSection {currentColors} />
</div>

<style>
	:global(body) {
		font-family:
			-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
		margin: 0;
		padding: 40px;
		background: var(--clr-bg-2);
		color: var(--clr-text-1);
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		background: var(--clr-bg-1);
		padding: 40px;
		border-radius: 12px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	}

	h1 {
		font-size: 32px;
		margin-bottom: 8px;
		font-weight: 600;
		color: var(--clr-text-1);
	}

	.subtitle {
		color: var(--clr-text-2);
		margin-bottom: 32px;
		font-size: 14px;
	}

	@media (max-width: 768px) {
		:global(body) {
			padding: 20px;
		}

		.container {
			padding: 20px;
		}
	}
</style>
