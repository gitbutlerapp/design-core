<script lang="ts">
	import { SEMANTIC_ZONES } from "../constants/colorScales";
</script>

<div class="semantic-zones">
	{#each SEMANTIC_ZONES as zone}
		<div class="zone">
			<div class="zone-label">{zone.label}</div>
			<div class="zone-range">{zone.range}</div>
		</div>
	{/each}
</div>

<style>
	.semantic-zones {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 32px;
		padding: 20px;
		background: var(--clr-bg-1-muted);
		border-radius: 8px;
	}

	.zone {
		text-align: center;
	}

	.zone-label {
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--clr-text-1);
	}

	.zone-range {
		font-size: 12px;
		color: var(--clr-text-2);
	}
</style>
