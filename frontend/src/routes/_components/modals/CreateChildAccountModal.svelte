<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { HDNodeWallet } from 'ethers';

	// c
	import Input from '@c/Input.svelte';
	import Modal from '@c/Modal.svelte';
	import Button from '@c/buttons/Button.svelte';
	import TextButton from '@c/buttons/TextButton.svelte';

	// ctx
	import { getGlobalStore } from '@stores/globalStore/globalStore.selector';
	import { clipAddress } from '@utils/clipAddress';

	// validators
	import { validateAccountIndex } from '@validators/accountIndexValidator';
	import { validateAccountName } from '@validators/accountNameValidator';
	import { AccountActions } from '@stores/globalStore/actions/accountActions';

	// global state
	const globalStore = getGlobalStore();

	// local state
	let indexStr = '';
	let indexErr = validateAccountIndex('', []);

	let name = '';
	let nameErr = validateAccountName('', []);

	let wallet: HDNodeWallet | undefined;

	const dispatch = createEventDispatcher();
	const storeActions = new AccountActions(globalStore);

	// event handlers
	function onCreateClick() {
		const index = parseInt(indexStr);

		if (!wallet) {
			alert('There is no account wallet to save!');
			return;
		}

		const err = storeActions.createAccount({
			name,
			index,
			wallet,
		});

		if (err === 'FAILED_TO_SAVE') {
			alert('Failed to save. Is localStorage allowed?');
			return;
		}

		if (err === 'NOT_AUTHORIZED') {
			alert('Unauthorized');
			return;
		}

		dispatch('close');
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
			indexErr = validateAccountIndex(indexStr, $globalStore.walletState.accounts);

			// reset generated wallet if index is invalid
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
			nameErr = validateAccountName(name, $globalStore.walletState.accounts);
		}}
	/>

	<span class="mt-3 block">{wallet ? clipAddress(wallet.address, 10) : ''}</span>

	<!-- buttons -->
	<div class="flex items-center mt-4">
		<Button disabled={Boolean(indexErr || nameErr)} on:click={onCreateClick}>CREATE</Button>

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
