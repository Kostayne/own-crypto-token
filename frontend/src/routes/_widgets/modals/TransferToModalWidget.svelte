<script lang="ts">
	import { isAddress } from 'ethers';
	import { createEventDispatcher } from 'svelte';
	import toast from 'svelte-french-toast';

	// c
	import Modal from '@c/Modal.svelte';
	import Input from '@c/Input.svelte';
	import Button from '@c/buttons/Button.svelte';

	// store
	import { ContractActions, getGlobalStore } from '@stores/globalStore';

	// store
	const globalStore = getGlobalStore();
	const contractActions = new ContractActions(globalStore);

	// state
	let value = '';
	let address = '';

	const dispatch = createEventDispatcher();

	// validators
	const validateValue = (val: string): string => {
		const num = parseInt(val);

		if (isNaN(num)) {
			return 'Not a number';
		}

		if (num <= 0) {
			return 'Should be positive';
		}

		return '';
	};

	// computed
	$: valueErr = validateValue(value);
	$: addressErr = isAddress(address) ? '' : 'Invalid address';

	// event handlers
	const onTransferClick = async () => {
		const val = parseInt(value);
		const balance = await contractActions.getBalance();

		// prevent transferring insufficient balance
		if (BigInt(val) < balance || balance === BigInt(0)) {
			toast.error('Not enough balance', { position: 'top-center' });
			valueErr = 'Too much';
			return;
		}

		const res = await contractActions.transferTo(address, val);

		if (res.isError) {
			console.error(res.unwrapErr());
			toast.error(res.unwrapErr().shortMessage, {
				position: 'top-center',
			});
		}

		console.log(typeof res.unwrap());
	};

	const onMaxClick = async () => {
		const balance = await contractActions.getBalance();
		value = balance.toString();
	};
</script>

<Modal title="Transfer to" on:close>
	<Input label="To address" bind:value={address} error={addressErr} />
	<Input label="Value" bind:value className="mt-2" error={valueErr} />

	<Button type="alternative" className="py-1 px-2 mt-2 !font-medium" on:click={onMaxClick}>
		max
	</Button>

	<div class="flex gap-3 mt-4">
		<Button disabled={!!valueErr || !!addressErr} on:click={onTransferClick}>TRANSFER</Button>
		<Button type="secondary" on:click={() => dispatch('close')}>CANCEL</Button>
	</div>
</Modal>
