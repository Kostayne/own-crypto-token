<script lang="ts">
	import { isAddress } from 'ethers';
	import { createEventDispatcher } from 'svelte';
	import toast from 'svelte-french-toast';

	// c
	import Modal from '@c/Modal.svelte';
	import Input from '@c/Input.svelte';
	import Button from '@c/buttons/Button.svelte';

	// validators
	import { validateTransferValue } from '@validators/transferValueValidator';

	// store
	import { ContractActions, getGlobalStore } from '@stores/globalStore';

	// cfg
	import { tokenSymbol } from '@src/cfg';

	// store
	const globalStore = getGlobalStore();
	const contractActions = new ContractActions(globalStore);

	// state
	let value = '';
	let address = '';

	const dispatch = createEventDispatcher();

	// computed
	$: valueErr = validateTransferValue(value);
	$: addressErr = isAddress(address) ? '' : 'Invalid address';

	// event handlers
	const onEmitClick = async () => {
		const val = parseInt(value);
		const res = await contractActions.mint(address, val);

		if (res.isError) {
			console.error(res.unwrapErr());
			toast.error(res.unwrapErr().shortMessage, {
				position: 'top-center',
			});

			return;
		}

		toast.success(`Successfully minted ${val} ${tokenSymbol}`);
		dispatch('close');
	};
</script>

<Modal title="Mint" on:close>
	<Input label="To address" bind:value={address} error={addressErr} />
	<Input label="Value" className="mt-2" bind:value error={valueErr} />

	<div class="flex gap-3 mt-4">
		<Button className="flex-grow" disabled={!!valueErr || !!addressErr} on:click={onEmitClick}>
			Mint
		</Button>

		<Button type="secondary" on:click={() => dispatch('close')}>CANCEL</Button>
	</div>
</Modal>
