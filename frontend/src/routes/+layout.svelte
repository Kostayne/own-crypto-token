<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	// styles
	import '../app.css';

	// types
	import type { GlobalStateData } from '@t/globalStateData.type';

	// stores
	let globalStore = writable<GlobalStateData>(undefined);

	// passing context to children
	setContext('globalState', globalStore);
</script>

<slot />
