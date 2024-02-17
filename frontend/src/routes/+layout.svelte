<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { HDNodeWallet } from 'ethers';

	// styles
	import '../app.css';

	let wallet = writable<HDNodeWallet>();
	setContext('wallet', wallet);
</script>

<slot />
