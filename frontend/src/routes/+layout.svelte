<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	// types
	import type { EncryptedData } from '@t/encryptedData.type';
	import type { HDNodeWallet } from 'ethers';

	// styles
	import '../app.css';

	// stores
	let encryptedData = writable<EncryptedData>(undefined);
	let wallet = writable<HDNodeWallet>(undefined);

	// passing context to children
	setContext('encrypted', encryptedData);
	setContext('wallet', wallet);
</script>

<slot />
