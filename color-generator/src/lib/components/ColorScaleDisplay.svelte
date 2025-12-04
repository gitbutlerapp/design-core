<script lang="ts">
	import ColorCard from "./ColorCard.svelte";
	import ScaleControls from "./ScaleControls.svelte";
	import type { ColorScale, Shade } from "../types/color";

	interface Props {
		scale: ColorScale;
		shades: Shade[];
		colors: Record<number, string>;
		saturation: number;
		shade50Lightness: number;
		hue: number | null;
		onHueChange: (scaleId: string, hexColor: string) => void;
		onSaturationChange: (scaleId: string, value: number) => void;
		onShade50LightnessChange: (scaleId: string, value: number) => void;
		onCopyJSON: (scaleId: string) => void;
	}

	let {
		scale,
		shades,
		colors,
		saturation = $bindable(),
		shade50Lightness = $bindable(),
		hue,
		onHueChange,
		onSaturationChange,
		onShade50LightnessChange,
		onCopyJSON,
	}: Props = $props();
</script>

<div class="scale-container">
	<ScaleControls
		{scale}
		bind:saturation
		bind:shade50Lightness
		{hue}
		{onHueChange}
		{onSaturationChange}
		{onShade50LightnessChange}
		{onCopyJSON}
	/>

	<div class="scale-grid">
		{#each shades as shade (shade.value)}
			{@const color = colors[shade.value] || "#000"}
			<ColorCard {shade} {color} scaleId={scale.id} />
		{/each}
	</div>
</div>

<style>
	.scale-container {
		margin-bottom: 48px;
	}

	.scale-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	}
</style>
