// vite.config.js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';

// Plugin to bypass host validation
const bypassHostValidation = {
	name: 'bypass-host-validation',
	configResolved(config) {
		// Force allow all hosts by modifying the server config
		if (config.server) {
			config.server.middlewareMode = true;
		}
	},
	transform(code) {
		// Replace Vite's host validation check with a no-op
		if (code.includes('validateAssets') || code.includes('allowedHosts')) {
			return code.replace(
				/(?:validateAssets|_allowedHosts|_normalizeHostname)/g,
				'() => true'
			);
		}
	}
};

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		}),
		bypassHostValidation
	],
	build: {
		chunkSizeWarningLimit: 1000
	},
	server: {
		allowedHosts: '.',
		hmr: false,
		middlewareMode: true
	}
});
