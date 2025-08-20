import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import { readFileSync } from 'node:fs';

const { version: name } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],
	kit: {
		adapter: adapterCloudflare(),
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Ignore 404 links to files
				if (/\.\w{1,4}$/.test(path)) {
					console.warn(`File not found ${path} (error: ${message})`);

					return;
				}

				throw new Error(message);
			},
			handleMissingId: 'warn'
		},
		version: { name }
	}
};

export default config;
