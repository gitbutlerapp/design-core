<script lang="ts">
	import { exportJSON, exportCSS, copyCSS } from "../utils/export";

	interface Props {
		currentColors: Record<string, Record<number, string>>;
	}

	let { currentColors }: Props = $props();

	async function handleCopyCSS() {
		await copyCSS(currentColors);
	}
</script>

<div class="export-section">
	<h2 class="export-title">Export Colors</h2>
	<div class="export-buttons">
		<button class="export-btn copy-btn" onclick={handleCopyCSS}
			>📋 Copy CSS</button
		>
		<button class="export-btn" onclick={() => exportJSON(currentColors)}
			>📦 Export JSON</button
		>
		<button class="export-btn" onclick={() => exportCSS(currentColors)}
			>📄 Export CSS</button
		>
	</div>
</div>

<style>
	.export-section {
		margin-top: 40px;
		padding: 24px;
		background: var(--clr-bg-1-muted);
		border-radius: 8px;
	}

	.export-title {
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 12px;
		color: var(--clr-text-1);
	}

	.export-buttons {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.export-btn {
		padding: 10px 20px;
		background: var(--clr-core-ntrl-30);
		color: var(--clr-core-ntrl-100);
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 13px;
		font-weight: 500;
		transition: background 0.2s;
	}

	.export-btn:hover {
		background: var(--clr-core-ntrl-20);
	}

	.copy-btn {
		background: var(--clr-core-pop-50);
	}

	.copy-btn:hover {
		background: var(--clr-core-pop-40);
	}
</style>
