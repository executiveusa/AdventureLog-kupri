import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import adapterNode from '@sveltejs/adapter-node';
import adapterVercel from '@sveltejs/adapter-vercel';

let adapter;
// Use Vercel adapter if building on Vercel or if NODE_ENV is production
// This ensures the correct output directory structure for Vercel deployment
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
	adapter = adapterVercel;
} else {
	adapter = adapterNode;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
