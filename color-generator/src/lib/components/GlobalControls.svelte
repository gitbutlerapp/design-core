<script lang="ts">
	interface Props {
		baseHue: number;
		onHueChange: (hue: number) => void;
	}

	let { baseHue = $bindable(), onHueChange }: Props = $props();
</script>

<div class="controls">
	<div class="control-group">
		<label for="baseHue">Base Hue</label>
		<input
			type="range"
			id="baseHue"
			min="0"
			max="360"
			bind:value={baseHue}
			oninput={() => onHueChange(baseHue)}
			step="1"
		/>
		<span class="range-value">{baseHue}°</span>
	</div>
</div>

<style>
	.controls {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 24px;
		margin-bottom: 40px;
		padding: 24px;
		background: #fafaf9;
		border-radius: 8px;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.control-group label {
		font-size: 13px;
		font-weight: 500;
		color: #383433;
	}

	.control-group input[type="range"] {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: #d6d3d1;
		outline: none;
		appearance: none;
		-webkit-appearance: none;
	}

	.range-value {
		font-size: 12px;
		color: #6b635e;
		font-weight: 500;
	}
</style>
