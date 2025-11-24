<script lang="ts">
	import { hslToHex } from "../utils/colorConversion";
	import type { ColorScale } from "../types/color";

	interface Props {
		scale: ColorScale;
		saturation: number;
		hue: number | null;
		onHueChange: (scaleId: string, hexColor: string) => void;
		onSaturationChange: (scaleId: string, value: number) => void;
		onCopyJSON: (scaleId: string) => void;
	}

	let {
		scale,
		saturation = $bindable(),
		hue,
		onHueChange,
		onSaturationChange,
		onCopyJSON,
	}: Props = $props();

	const displayHue = $derived(hue !== null ? hue : scale.baseHue || 180);
	const colorPickerValue = $derived(hslToHex(displayHue, 0.7, 0.5));

	function handleHueChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		onHueChange(scale.id, target.value);
	}

	function handleSaturationChange() {
		onSaturationChange(scale.id, saturation);
	}
</script>

<div class="scale-header">
	<div class="scale-header-left">
		<span class="scale-name">{scale.name}</span>
		<div class="scale-control">
			<label>Hue:</label>
			<input
				type="color"
				value={colorPickerValue}
				oninput={handleHueChange}
			/>
		</div>
		<div class="scale-control">
			<label>Saturation:</label>
			<input
				type="range"
				min="0"
				max="100"
				bind:value={saturation}
				oninput={handleSaturationChange}
			/>
			<span class="range-value">{saturation}%</span>
		</div>
	</div>
	<button class="copy-all-btn" onclick={() => onCopyJSON(scale.id)}
		>Copy JSON</button
	>
</div>

<style>
	.scale-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		flex-wrap: wrap;
		gap: 12px;
	}

	.scale-header-left {
		display: flex;
		align-items: center;
		gap: 16px;
		flex: 1;
		flex-wrap: wrap;
	}

	.scale-name {
		font-size: 18px;
		font-weight: 600;
		color: var(--clr-text-1);
	}

	.scale-control {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
	}

	.scale-control label {
		font-size: 12px;
		color: var(--clr-text-2);
		white-space: nowrap;
	}

	.scale-control input[type="range"] {
		width: 100px;
		height: 4px;
	}

	.scale-control input[type="color"] {
		width: 32px;
		height: 32px;
		border: 2px solid var(--clr-border-2);
		border-radius: 4px;
		cursor: pointer;
		padding: 0;
	}

	.scale-control .range-value {
		font-size: 12px;
		min-width: 35px;
		color: var(--clr-text-1);
		font-weight: 500;
	}

	.copy-all-btn {
		padding: 8px 16px;
		background: var(--clr-core-pop-50);
		color: var(--clr-core-ntrl-100);
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 12px;
		font-weight: 500;
		transition: background 0.2s;
	}

	.copy-all-btn:hover {
		background: var(--clr-core-pop-40);
	}
</style>
