import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		conditions: ["browser"],
	},
	server: {
		port: 5174,
	},
});
