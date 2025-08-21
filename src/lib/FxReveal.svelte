<script lang="ts">
	import Img from './SvelteImg.svelte';
	import { observe, hasObjectKeys, lqipToBackground } from './utils.js';
	import { onMount } from 'svelte';
	import type { ImageSourceObject } from '$lib/types.js';
	import type { HTMLImgAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLImgAttributes, 'src'> {
		/**
		 * Imagetools import meta
		 */
		src: string | null | undefined | unknown;

		/**
		 * Bindable reference to &lt;img&gt; element
		 */
		ref?: HTMLImageElement;
	}

	let { src, ref = $bindable(), ...rest }: Props = $props();

	const typedSrc = $derived(src as ImageSourceObject);

	let meta: ImageSourceObject = $state({});
	let background = $state<string>();
	let isMounted = $state(false);
	let isLoaded = $state(false);
	let isInView = $state(false);

	$effect(() => {
		if (hasObjectKeys(typedSrc)) {
			isLoaded = false;
			background = typedSrc.img?.lqip ? lqipToBackground(typedSrc.img?.lqip) : undefined;
			const { sources = {} } = typedSrc;
			meta = { img: { src: typedSrc.img?.src, w: typedSrc.img?.w, h: typedSrc.img?.w }, sources };
		} else {
			meta = {};
		}
	});

	onMount(() => {
		isMounted = true;

		if (ref?.complete) {
			isLoaded = true;
		}
	});
</script>

{#if hasObjectKeys(meta)}
	<div
		class="wrap"
		class:mounted={isMounted}
		class:reveal={isLoaded && isInView}
		{@attach observe}
		onenter={() => (isInView = true)}
	>
		<Img {...rest} bind:ref onload={() => (isLoaded = true)} src={meta} />
		<div class="lqip" style:background></div>
	</div>
{/if}

<style>
	.wrap {
		position: relative;
		overflow: hidden;
	}

	.wrap :global(img) {
		margin: 0;
	}

	.mounted :global(img) {
		opacity: 0;
		transform: var(--reveal-transform, scale(1.02));
	}

	.mounted.reveal :global(img) {
		transition: var(--reveal-transition, opacity 1s ease-in, transform 0.8s ease-out);
		opacity: 1;
		transform: scale(1);
	}

	.lqip {
		position: absolute;
		inset: 0;
		z-index: -1;
	}

	.lqip::after {
		content: '';
		position: absolute;
		inset: 0;
		backdrop-filter: var(--reveal-filter, blur(20px));
	}
</style>
