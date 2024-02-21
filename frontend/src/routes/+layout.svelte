<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	// styles
	import '../app.css';

	// types
	import type { EncryptedData } from '@t/encryptedData.type';
	import type { WalletState } from '@t/walletState.type';

	// stores
	let encryptedData = writable<EncryptedData>(undefined);
	let walletState = writable<WalletState>(undefined);

	// passing context to children
	setContext('encrypted', encryptedData);
	setContext('walletState', walletState);
</script>

<slot />
