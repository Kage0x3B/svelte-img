<script lang="ts">
	import Picture from './Picture.svelte';
	import { hasObjectKeys, lqipToBackground } from './utils.js';
	import type { HTMLImgAttributes } from 'svelte/elements';
	import type { ImageSourceObject } from '$lib/types.js';

	interface Props extends Omit<HTMLImgAttributes, 'src'> {
		/**
		 * Imagetools import meta
		 */
		src: string | null | undefined | unknown;

		/**
		 * &lt;img&gt; element `sizes` attr
		 */
		sizes?: string;

		/**
		 * &lt;img&gt; `width` override
		 */
		width?: number;

		/**
		 * &lt;img&gt; `height` override
		 */
		height?: number;

		/**
		 * &lt;img&gt; element `loading` attr
		 * @default 'lazy'
		 */
		loading?: 'lazy' | 'eager';

		/**
		 * &lt;img&gt; element `decoding` attr
		 * @default 'async'
		 */
		decoding?: 'async' | 'auto' | 'sync';

		/**
		 * Bindable reference to &lt;img&gt; element
		 */
		ref?: HTMLImageElement;
	}

	let {
		src,
		sizes,
		width,
		height,
		loading = 'lazy',
		decoding = 'async',
		alt = '',
		ref = $bindable(),
		...rest
	}: Props = $props();

	const typedSrc = $derived(typeof src === 'object' ? (src as ImageSourceObject) : undefined);
	const background = $derived(
		hasObjectKeys(typedSrc?.img) && typedSrc?.img?.lqip ? lqipToBackground(typedSrc.img.lqip) : undefined
	);
</script>

<!-- @component
High-performance responsive/progressive images for SvelteKit.

@example
<script>
  import Img from '@zerodevx/svelte-img'
  import src from '$lib/assets/cat.jpg?as=run'
</script>

<Img {src} alt="cute cat" />
-->

{#if typedSrc?.sources && typedSrc?.img}
	<Picture sources={typedSrc.sources} {sizes}>
		<img
			{...rest}
			{loading}
			{decoding}
			{alt}
			width={width || typedSrc.img.w || undefined}
			height={height || typedSrc.img.h || undefined}
			style:background
			bind:this={ref}
			src={typedSrc.img.src}
		/>
	</Picture>
{:else if src && typeof src === 'string'}
	<img
		{...rest}
		{loading}
		{decoding}
		{alt}
		width={width || undefined}
		height={height || undefined}
		bind:this={ref}
		{src}
	/>
{/if}
