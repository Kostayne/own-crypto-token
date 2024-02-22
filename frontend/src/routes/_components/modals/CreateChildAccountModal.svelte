<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { HDNodeWallet } from 'ethers';

	// c
	import Input from '@c/Input.svelte';
	import Modal from '@c/Modal.svelte';
	import Button from '@c/buttons/Button.svelte';
	import TextButton from '@c/buttons/TextButton.svelte';

	// utils
	import { saveEncryptedData } from '@utils/encryptedDataStore';

	// ctx
	import { getGlobalStore } from '@ctx/getGlobalStore';
	import { clipAddress } from '@utils/clipAddress';

	// local state
	let indexStr = '';
	let indexErr = validateIndex('');

	let name = '';
	let nameErr = validateName('');

	let wallet: HDNodeWallet | undefined;

	const dispatch = createEventDispatcher();

	// global state
	const globalStore = getGlobalStore();

	// event handlers
	function onSaveClick() {
		if (!$globalStore) {
			alert('You are not authorized!');
			return;
		}

		if (!wallet) {
			throw new Error('No wallet to save!');
		}

		const globalState = { ...$globalStore };
		const index = parseInt(indexStr);

		// adding new account into encrypted data
		globalState.encrypted.accounts.push({
			index,
			name,
		});

		// adding new account into wallet state
		globalState.walletState.accounts.push({
			name,
			index,
			wallet,
		});

		// setting global state
		globalStore.set(globalState);

		// saving changes in browser
		try {
			saveEncryptedData(globalState.encrypted, globalState.password);
		} catch (e) {
			console.error(e);
			alert('Failed to save new account');
			throw new Error('Failed to save new account!');
		}

		dispatch('close');
	}

	function validateName(val: string): string {
		if (val.length === 0) {
			return 'Empty name';
		}

		if (val.length > 12) {
			return 'Too long';
		}

		return '';
	}

	function validateIndex(val: string): string {
		const parsed = parseInt(val);

		if (isNaN(parsed)) {
			return 'Only numbers allowed';
		}

		if (parsed <= 0) {
			return 'Negative or zero value';
		}

		if ($globalStore.encrypted.accounts.some((a) => a.index === parsed)) {
			return 'The index already taken';
		}

		return '';
	}

	function deriveWallet(index: number) {
		wallet = $globalStore.walletState.mainWallet.deriveChild(index);
	}
</script>

<Modal on:close title="Create account">
	<Input
		label="Index"
		value={indexStr}
		error={indexErr}
		on:change={(e) => {
			indexStr = e.detail;
			indexErr = validateIndex(indexStr);

			// reset generated wallet
			// if index is invalid
			if (indexErr) {
				wallet = undefined;
				return;
			}

			deriveWallet(parseInt(indexStr));
		}}
	/>

	<Input
		label="Name"
		value={name}
		error={nameErr}
		className="mt-2"
		on:change={(e) => {
			name = e.detail;
			nameErr = validateName(name);
		}}
	/>

	<span class="mt-3 block">{wallet ? clipAddress(wallet.address, 10) : ''}</span>

	<!-- buttons -->
	<div class="flex items-center mt-4">
		<Button disabled={Boolean(indexErr || nameErr)} on:click={onSaveClick}>SAVE</Button>

		<TextButton
			className="ml-auto"
			on:click={() => {
				dispatch('close');
			}}
		>
			CANCEL
		</TextButton>
	</div>
</Modal>
