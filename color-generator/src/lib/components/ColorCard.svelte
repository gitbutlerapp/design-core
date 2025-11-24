<script lang="ts">
	import { getContrastRatio } from "../utils/contrast";
	import { copyToClipboard } from "../utils/export";
	import type { Shade } from "../types/color";

	interface Props {
		shade: Shade;
		color: string;
		scaleId: string;
		onCopy?: (color: string) => void;
	}

	let { shade, color, scaleId, onCopy }: Props = $props();

	const contrast = $derived(getContrastRatio(color, "#ffffff"));
	const contrastText = $derived(getContrastRatio(color, "#000000"));
	const wcagPass = $derived(Math.max(contrast, contrastText) >= 4.5);

	async function handleCopyColor() {
		await copyToClipboard(color);
		onCopy?.(color);
	}

	async function handleCopyButton(e: MouseEvent) {
		e.stopPropagation();
		await copyToClipboard(color);
		onCopy?.(color);
	}
</script>

<div
	class="color-card"
	data-scale={scaleId}
	data-shade={shade.value}
	onclick={handleCopyColor}
	role="button"
	tabindex="0"
>
	<div class="color-swatch" style="background-color: {color}">
		<div
			class="contrast-indicator {wcagPass
				? 'contrast-pass'
				: 'contrast-fail'}"
		>
			{Math.max(contrast, contrastText).toFixed(1)}:1
		</div>
	</div>
	<div class="color-info">
		<div class="shade-number">{shade.value}</div>
		<div class="shade-purpose">{shade.purpose}</div>
		<div class="color-values">
			<div class="color-value">
				<span>{color.toUpperCase()}</span>
				<button class="copy-btn" onclick={handleCopyButton}>📋</button>
			</div>
		</div>
	</div>
</div>

<style>
	.color-card {
		border: 1px solid var(--clr-border-3);
		border-radius: 8px;
		overflow: hidden;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		cursor: pointer;
	}

	.color-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	}

	.color-swatch {
		height: 80px;
		position: relative;
	}

	.color-info {
		padding: 12px;
		background: var(--clr-bg-1);
	}

	.shade-number {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 4px;
		color: var(--clr-text-1);
	}

	.shade-purpose {
		font-size: 11px;
		color: var(--clr-text-2);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 8px;
	}

	.color-value {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 11px;
		font-family: "Courier New", monospace;
		color: var(--clr-text-1);
	}

	.copy-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 4px;
		font-size: 10px;
		opacity: 0;
		transition:
			opacity 0.2s,
			background 0.2s;
	}

	.color-card:hover .copy-btn {
		opacity: 1;
	}

	.copy-btn:hover {
		background: var(--clr-core-pop-50);
		color: var(--clr-core-ntrl-100);
	}

	.contrast-indicator {
		position: absolute;
		bottom: 4px;
		right: 4px;
		font-size: 10px;
		padding: 2px 6px;
		border-radius: 3px;
		font-weight: 600;
	}

	.contrast-pass {
		background: rgba(74, 181, 130, 0.9);
		color: white;
	}

	.contrast-fail {
		background: rgba(220, 96, 107, 0.9);
		color: white;
	}
</style>
