import type { Attachment } from 'svelte/attachments';

let observer: IntersectionObserver;

export type ObserveCustomEventDetails = IntersectionObserverEntry;

export const observe = ((node) => {
	observer =
		observer ||
		new IntersectionObserver((entries) => {
			for (const detail of entries) {
				const { isIntersecting, target } = detail;
				target.dispatchEvent(
					new CustomEvent<ObserveCustomEventDetails>(isIntersecting ? 'enter' : 'leave', { detail })
				);
			}
		});

	observer.observe(node);

	return () => {
		observer.unobserve(node);
	};
}) satisfies Attachment;

export function hasObjectKeys(obj: unknown): boolean {
	return Boolean(obj && typeof obj === 'object' && Object.keys(obj).length);
}

export function lqipToBackground(lqip: string): string {
	return lqip[0] === '#' ? lqip : `url(data:image/webp;base64,${lqip}) no-repeat center/cover`;
}
