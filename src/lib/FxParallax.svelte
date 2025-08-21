<script lang="ts">
	import Img from './SvelteImg.svelte';
	import { observe, type ObserveCustomEventDetails } from './utils.js';
	import { onMount } from 'svelte';
	import type { ClassValue, HTMLImgAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLImgAttributes, 'src'> {
		src: string | null | undefined | unknown;

		/**
		 * Class list forwarded to &lt;img&gt; wrapper
		 */
		class?: ClassValue;
		/**
		 * Number between 0 and 1 to control speed relative to scroll:
		 * - value closer to 0 is faster, while a value closer to 1 is slower
		 * - value of 1 behaves normally
		 * - value of 0 effectively makes the element scroll fixed with the page
		 */
		factor?: number;

		/**
		 * Bindable reference to &lt;img&gt; element
		 */
		ref?: HTMLImageElement;
	}

	let { class: className, factor = 0.75, ref = $bindable(), ...rest }: Props = $props();

	let isMounted = $state(false);
	let isInView = $state(false);
	let scrollY = $state(0);
	let offsetHeight = $state(0);
	let screenHeight = $state(0);
	let stamp = $state(0);

	function entered(event: CustomEvent<ObserveCustomEventDetails>): void {
		stamp = scrollY + event.detail.boundingClientRect.top;
		isInView = true;
	}

	function resized() {
		screenHeight = window.screen.height;
	}

	const normalized = $derived(Math.abs(factor - 1));
	const height = $derived(
		screenHeight && offsetHeight ? 100 + normalized * (screenHeight / offsetHeight) * 100 : 100
	);

	const offset = $derived(isInView ? Math.floor((scrollY - stamp) * normalized) : 0);

	onMount(() => {
		resized();

		isMounted = true;
	});
</script>

<svelte:window bind:scrollY onresize={resized} />

<div
	class={['wrap', className]}
	class:mounted={isMounted}
	bind:offsetHeight
	{@attach observe}
	onenter={entered}
	onleave={() => (isInView = false)}
>
	<Img {...rest} style="height:{height}%;transform:translate(0,{offset}px)" bind:ref />
</div>

<style>
	.wrap {
		position: relative;
		overflow: hidden;
	}
	.wrap :global(img) {
		width: 100%;
		object-fit: cover;
		will-change: transform;
		margin: 0;
	}
</style>
