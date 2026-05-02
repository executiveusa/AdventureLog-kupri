// vite.config.js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	build: {
		chunkSizeWarningLimit: 1000
	},
	server: {
		host: '0.0.0.0',
		allowedHosts: true
	}
});
