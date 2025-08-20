<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';
	import type { LayoutProps } from './$types.js';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>DEMO | svelte-img</title>
	<meta name="description" content="High-performance responsive/progressive images for SvelteKit." />
</svelte:head>

{@render children()}
