<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { onNavigate } from '$app/navigation';
	import { Toaster } from 'svelte-french-toast';

	// styles
	import '../app.css';

	// types
	import type { GlobalStateData } from '@stores/globalStore/globalStateData.type';

	// stores
	let globalStore = writable<GlobalStateData | undefined>(undefined);

	// passing context to children
	setContext('globalState', globalStore);

	onNavigate((nav) => {
		if (!document.startViewTransition) {
			return;
		}

		return new Promise((res) => {
			document.startViewTransition(async () => {
				res();
				await nav.complete;
			});
		});
	});
</script>

<slot />

<Toaster toastOptions={{ duration: 2000 }} position="top-center" />
