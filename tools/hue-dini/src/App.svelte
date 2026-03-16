<script>
	// Lightness scale — non-linear, perceptually balanced
	const defaultLums = [97, 94, 89, 78, 65, 46, 37, 29, 21, 14, 10];
	const params = new URLSearchParams(window.location.search);
	const fromUrlLums = params
		.get("lums")
		?.split(",")
		.map((v) => Number(v.trim()))
		.filter((v) => Number.isFinite(v) && v >= 0 && v <= 100);
	const scaleLabels = [95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5];

	const neutralPresets = {
		Gray: "#888888",
		Slate: "#64748b",
		Stone: "#78716c",
		Zinc: "#71717a",
		Neutral: "#737373",
		"Cool Gray": "#9ca3af",
		"Warm Gray": "#a3a3a3",
	};

	let colorPresets = $state({
		pop: "#25b1b1",
		danger: "#d64029",
		warning: "#f99406",
		safe: "#2eb87e",
		purple: "#8a43d0",
	});

	let stops = $state(
		(fromUrlLums?.length ? fromUrlLums : defaultLums)
			.slice(0, 11)
			.sort((a, b) => b - a),
	);

	let colors = $state([
		{ id: crypto.randomUUID(), hex: "#888888", label: "Gray" },
	]);

	let popColorInputEl = $state(null);
	let copied = $state(false);

	function clamp(v, lo = 0, hi = 100) {
		return Math.min(Math.max(Number.isFinite(v) ? v : lo, lo), hi);
	}

	function normalizeHex(value) {
		const cleaned = value.trim().replace("#", "");
		if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
		return "#" + cleaned.toLowerCase();
	}

	function hexToHsl(hex) {
		const safe = normalizeHex(hex) ?? "#888888";
		const r = parseInt(safe.slice(1, 3), 16) / 255;
		const g = parseInt(safe.slice(3, 5), 16) / 255;
		const b = parseInt(safe.slice(5, 7), 16) / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const d = max - min;
		let h = 0;
		const l = (max + min) / 2;
		const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
		if (d !== 0) {
			switch (max) {
				case r:
					h = (((g - b) / d) % 6) * 60;
					break;
				case g:
					h = ((b - r) / d + 2) * 60;
					break;
				default:
					h = ((r - g) / d + 4) * 60;
					break;
			}
			if (h < 0) h += 360;
		}
		return { h, s, l };
	}

	function toRampCss(baseHex, lum) {
		const { h, s, l: baseL } = hexToHsl(baseHex);
		const baseLPct = baseL * 100;
		const anchor = 46;
		const scaledLum =
			lum <= anchor
				? baseLPct * (lum / anchor)
				: 100 - (100 - baseLPct) * ((100 - lum) / (100 - anchor));
		const satScale =
			scaledLum > 60 ? 1 - ((scaledLum - 60) / 40) * 0.18 : 1;
		const finalS = clamp(s * satScale * 100);
		return `hsl(${h.toFixed(1)} ${finalS.toFixed(1)}% ${clamp(scaledLum).toFixed(2)}%)`;
	}

	// Drag logic
	let trackEl = $state(null);
	let draggingIndex = $state(null);

	function startDrag(e, index) {
		e.preventDefault();
		draggingIndex = index;
		window.addEventListener("pointermove", onDragMove);
		window.addEventListener("pointerup", onDragEnd);
	}

	function onDragMove(e) {
		if (draggingIndex === null || !trackEl) return;
		const rect = trackEl.getBoundingClientRect();
		const raw = ((rect.right - e.clientX) / rect.width) * 100;
		const next = [...stops];
		next[draggingIndex] = Math.round(clamp(raw) * 100) / 100;
		stops = next;
		syncUrl();
	}

	function onDragEnd() {
		draggingIndex = null;
		window.removeEventListener("pointermove", onDragMove);
		window.removeEventListener("pointerup", onDragEnd);
	}

	function updateColorHex(id, value) {
		const normalized = normalizeHex(value);
		if (!normalized) return;
		colors = colors.map((c) =>
			c.id === id ? { ...c, hex: normalized } : c,
		);
		syncUrl();
	}

	function updateColorLabel(id, value) {
		colors = colors.map((c) => (c.id === id ? { ...c, label: value } : c));
	}

	function syncUrl() {
		const url = new URL(window.location.href);
		url.searchParams.set("lums", stops.map((v) => v.toFixed(2)).join(","));
		history.replaceState({}, "", url);
	}

	const _canvas = document.createElement("canvas");
	_canvas.width = _canvas.height = 1;
	const _ctx = _canvas.getContext("2d");

	function hslCssToHex(hslStr) {
		_ctx.fillStyle = hslStr;
		_ctx.fillRect(0, 0, 1, 1);
		const [r, g, b] = _ctx.getImageData(0, 0, 1, 1).data;
		return (
			"#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")
		);
	}

	async function copyColorsJson() {
		const allColors = [
			...colors,
			...Object.entries(colorPresets).map(([name, hex]) => ({
				id: crypto.randomUUID(),
				hex,
				label: name,
			})),
		];
		const palette = {};
		for (const color of allColors) {
			const colorObj = {};
			for (let si = 0; si < sortedStops.length; si++) {
				colorObj[scaleLabels[si]] = {
					$type: "color",
					$value: hslCssToHex(
						toRampCss(color.hex, sortedStops[si].v),
					),
					$description: "",
					$extensions: { mode: {} },
				};
			}
			// Add 0 (pure black) and 100 (pure white) for gray only
			const isGray = color === allColors[0];
			if (isGray) {
				colorObj[0] = {
					$type: "color",
					$value: "#000000",
					$description: "",
					$extensions: { mode: {} },
				};
				colorObj[100] = {
					$type: "color",
					$value: "#ffffff",
					$description: "",
					$extensions: { mode: {} },
				};
			}
			palette[color.label.toLowerCase()] = colorObj;
		}
		await navigator.clipboard.writeText(
			JSON.stringify({ "clr-core": palette }, null, 2),
		);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	// Sorted light→dark
	const sortedStops = $derived(
		[...stops].map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v),
	);

	const centerIdx = $derived(Math.floor(sortedStops.length / 2));

	$effect(() => {
		const root = document.documentElement;
		sortedStops.forEach(({ v }, si) => {
			root.style.setProperty(
				`--gray-${scaleLabels[si]}`,
				toRampCss(colors[0].hex, v),
			);
		});
	});

	function selectGrayPreset(name, hex) {
		updateColorHex(colors[0].id, hex);
		updateColorLabel(colors[0].id, name);
	}
</script>

<main class="page">
	<!-- Header -->
	<header class="header">
		<h1>hue-dini</h1>
		<button class="copy-btn" onclick={copyColorsJson}
			>{copied ? "Copied!" : "Copy output"}</button
		>
	</header>

	<!-- Adjustment scale -->
	<div class="scale-track" bind:this={trackEl}>
		{#each stops as stop, i}
			<button
				class="dot"
				class:dragging={draggingIndex === i}
				style="left: {100 - stop}%"
				onpointerdown={(e) => startDrag(e, i)}
				aria-label="Luminance stop {stop.toFixed(1)}%"
			></button>
		{/each}
	</div>

	<!-- Breakpoint labels -->
	<div class="breakpoints">
		<div class="bp-zone" style="flex: 2">
			<span class="bp-label">Background</span>
			<span class="bp-range">100–90</span>
		</div>
		<div class="bp-zone" style="flex: 3">
			<span class="bp-label">Soft</span>
			<span class="bp-range">80–60</span>
		</div>
		<div class="bp-zone" style="flex: 3">
			<span class="bp-label">Foreground</span>
			<span class="bp-range">50–30</span>
		</div>
		<div class="bp-zone" style="flex: 3">
			<span class="bp-label">Text</span>
			<span class="bp-range">20–0</span>
		</div>
	</div>

	<!-- Gray ramp (large) -->
	<div class="ramp ramp-large">
		{#each sortedStops as { v }, si}
			<div
				class="swatch"
				style="background: {toRampCss(colors[0].hex, v)}"
			>
				{#if si === centerIdx}
					<div class="swatch-sq-wrap">
						<button
							class="swatch-sq"
							tabindex="-1"
							aria-hidden="true"
						></button>
						<select
							class="swatch-native-select"
							value={colors[0].label}
							onchange={(e) => {
								const name = e.currentTarget.value;
								const hex = neutralPresets[name];
								if (hex) selectGrayPreset(name, hex);
							}}
						>
							{#each Object.entries(neutralPresets) as [name]}
								<option value={name}>{name}</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Pop color ramp (smaller) -->
	<div class="ramp ramp-pop">
		{#each sortedStops as { v }, si}
			<div
				class="swatch"
				style="background: {toRampCss(colorPresets.pop, v)}"
			>
				{#if si === centerIdx}
					<button
						class="swatch-sq"
						onclick={() => popColorInputEl?.click()}
						aria-label="Pick pop color"
					></button>
					<input
						bind:this={popColorInputEl}
						type="color"
						value={colorPresets.pop}
						class="hidden-color-input"
						oninput={(e) => {
							colorPresets.pop = e.currentTarget.value;
						}}
					/>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Extra color ramps: danger, warning, safe, purple -->
	<div class="extra-ramps">
		{#each ["danger", "warning", "safe", "purple"] as name}
			<div class="ramp ramp-small">
				{#each sortedStops as { v }}
					<div
						class="swatch"
						style="background: {toRampCss(colorPresets[name], v)}"
					></div>
				{/each}
			</div>
		{/each}
	</div>
</main>

<style>
	.page {
		display: grid;
		grid-template-rows: auto auto auto 2fr 1fr auto;
		gap: 16px;
		padding: 40px;
		min-height: 100vh;
		box-sizing: border-box;
	}

	/* ── Header ── */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 16px;
	}

	h1 {
		margin: 0;
		font-size: 1.4rem;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.copy-btn {
		background: none;
		border: none;
		border-bottom: 1px dotted currentColor;
		cursor: pointer;
		font-family: inherit;
		font-size: 0.875rem;
		padding: 0;
		color: inherit;
	}

	.copy-btn:hover {
		opacity: 0.6;
	}

	/* ── Adjustment scale ── */
	.scale-track {
		position: relative;
		height: 80px;
		border-radius: 20px;
		background: linear-gradient(to right, #ffffff, #000000);
	}

	.dot {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: white;
		border: 1px solid rgba(0, 0, 0, 1);
		cursor: grab;
		padding: 0;
		z-index: 1;
		touch-action: none;
		transition:
			box-shadow 0.1s,
			transform 0.1s;
	}

	.dot:hover {
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.22),
			0 4px 14px rgba(0, 0, 0, 0.15);
	}

	.dot.dragging {
		cursor: grabbing;
		transform: translate(-50%, -50%) scale(1.15);
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
		z-index: 2;
	}

	/* ── Breakpoints ── */
	.breakpoints {
		display: flex;
		margin-bottom: -8px;
	}

	.bp-zone {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 0 0 6px 0;
		border-left: 1px solid currentColor;
		padding-left: 8px;
		opacity: 0.4;
	}

	.bp-label {
		font-size: 0.75rem;
		font-weight: 500;
	}

	.bp-range {
		font-size: 0.65rem;
		opacity: 0.7;
	}

	/* ── Ramps ── */
	.ramp {
		display: flex;
		border-radius: 20px;
		overflow: hidden;
	}

	/* Large gray ramp — overflow visible so dropdown isn't clipped */
	.ramp-large {
		overflow: visible;
		border-radius: 0;
	}

	.ramp-large .swatch:first-child {
		border-radius: 20px 0 0 20px;
	}

	.ramp-large .swatch:last-child {
		border-radius: 0 20px 20px 0;
	}

	.ramp-small {
		border-radius: 0;
	}

	.swatch {
		flex: 1;
		position: relative;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 24px 0;
	}

	/* ── Picker squares ── */
	.swatch-sq-wrap {
		position: relative;
		width: 28px;
		height: 28px;
	}

	.swatch-sq {
		width: 28px;
		height: 28px;
		background: transparent;
		border: 1.5px solid rgba(255, 255, 255, 0.6);
		cursor: pointer;
		padding: 0;
		transition:
			border-color 0.15s,
			transform 0.12s;
	}

	.swatch-sq:hover,
	.swatch-sq-wrap:hover .swatch-sq {
		border-color: rgba(255, 255, 255, 0.95);
	}

	.swatch-native-select {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
		width: 100%;
		height: 100%;
	}

	.hidden-color-input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
		width: 0;
		height: 0;
		padding: 0;
		border: none;
	}

	/* ── Extra ramps ── */
	.extra-ramps {
		display: grid;
		border-radius: 20px;
		overflow: hidden;
	}
</style>
