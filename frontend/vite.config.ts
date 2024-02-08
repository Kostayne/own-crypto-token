import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// custom
import svg from '@poppanator/sveltekit-svg';

export default defineConfig({
	plugins: [
		sveltekit(),
		svg(),
	],
});
