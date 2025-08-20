import { imagetools, pictureFormat, type VitePluginOptions } from 'vite-imagetools';
import type { Plugin } from 'vite';
import type { OutputFormat } from 'imagetools-core';
import type { ImageSourceObject } from '$lib/types.js';

type MaybePromise<T> = T | Promise<T>;

const run = ((cfg) => {
	return async function (metadatas) {
		const pic = pictureFormat()(metadatas) as ImageSourceObject;
		const lqipSize = (cfg && cfg.length && Number.parseInt(cfg[0])) ?? 16;

		if (lqipSize && pic.img) {
			const metadata = metadatas.find((i) => i.src === pic.img?.src);

			if (metadata) {
				const { image } = metadata;

				if (lqipSize > 1) {
					const buf = await image
						.clone()
						.resize({ width: lqipSize })
						.toFormat('webp', { quality: 20 })
						.toBuffer();
					pic.img.lqip = buf.toString('base64');
				} else {
					const { dominant } = await image.stats();
					const { r, g, b } = dominant;
					pic.img.lqip = '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
				}
			}
		}

		return pic;
	};
}) satisfies OutputFormat;

function main({
	profiles = {},
	/** @deprecated will be removed in next major */
	runDefaultDirectives = new URLSearchParams('w=480;1024;1920&format=avif;webp;jpg'),
	defaultDirectives = new URLSearchParams(),
	exclude = '{build,dist,node_modules}/**/*',
	extendOutputFormats = (i) => i, //noop
	...rest
}: {
	profiles?: Record<string, URLSearchParams>;
	runDefaultDirectives?: MaybePromise<URLSearchParams>;
	defaultDirectives?: MaybePromise<URLSearchParams>;
} & Partial<Omit<VitePluginOptions, 'defaultDirectives'>> = {}): Plugin {
	const dict: Record<string, MaybePromise<URLSearchParams>> = {
		run: runDefaultDirectives,
		...profiles
	};

	return imagetools({
		defaultDirectives: (url) => {
			const key = url.searchParams.get('as')?.split(':')[0];
			return key && Object.keys(dict).includes(key) ? dict[key] : defaultDirectives;
		},
		extendOutputFormats: (builtins) => ({
			...extendOutputFormats(builtins),
			...Object.keys(dict).reduce((a, c) => ({ ...a, [c]: run }), {})
		}),
		exclude,
		cache: {
			enabled: false // TODO: Currently cache needs to be disabled to access the metadata.image property for lqips
		},
		...rest
	});
}

export { main as imagetools, run };
