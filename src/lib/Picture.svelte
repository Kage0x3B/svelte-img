<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		sources: Record<string, string>;

		sizes?: string;

		children?: Snippet;
	}

	let { children, sources, sizes }: Props = $props();

	const sourcesArray = $derived(Object.entries(sources));
</script>

{#if sourcesArray.length}
	<picture>
		{#each sourcesArray as [format, srcset] (srcset)}
			<source type="image/{format}" {sizes} {srcset} />
		{/each}
		{@render children?.()}
	</picture>
{:else}
	{@render children?.()}
{/if}
