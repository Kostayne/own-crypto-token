<script lang="ts">
	import { isAddress } from 'ethers';
	import { createEventDispatcher } from 'svelte';
	import toast from 'svelte-french-toast';

	// c
	import Modal from '@c/Modal.svelte';
	import Input from '@c/Input.svelte';
	import Button from '@c/buttons/Button.svelte';
	import MaxValueButton from '../../_components/buttons/MaxValueButton.svelte';

	// validators
	import { validateTransferValue } from '@validators/transferValueValidator';

	// store
	import { ContractActions, getGlobalStore } from '@stores/globalStore';

	// store
	const globalStore = getGlobalStore();
	const contractActions = new ContractActions(globalStore);

	// state
	let value = '';
	let fromAddress = '';
	let toAddress = '';

	const dispatch = createEventDispatcher();

	// validators
	const validateToAddress = (from: string, to: string): string => {
		if (!isAddress(to)) {
			return 'Invalid address';
		}

		if (from === to) {
			return 'Addresses should not match';
		}

		return '';
	};

	// computed
	$: valueErr = validateTransferValue(value);
	$: fromAddressErr = isAddress(fromAddress) ? '' : 'Invalid address';
	$: toAddressErr = validateToAddress(fromAddress, toAddress);

	// event handlers
	const onTransferClick = async () => {
		const val = parseInt(value);

		// TODO fetch allowance here
		const allowance = BigInt(0);

		// prevent transferring insufficient balance
		if (BigInt(val) < allowance || allowance === BigInt(0)) {
			toast.error('Not enough balance', { position: 'top-center' });
			valueErr = 'Too much';
			return;
		}

		const res = await contractActions.transferTo(fromAddress, val);

		if (res.isError) {
			console.error(res.unwrapErr());
			toast.error(res.unwrapErr().shortMessage, {
				position: 'top-center',
			});
		}
	};

	const onMaxClick = async () => {
		if (fromAddressErr) {
			toast.error('Type valid from address', { position: 'top-center', duration: 2500 });
			return;
		}

		const allowanceRes = await contractActions.allowance(fromAddress);

		if (allowanceRes.isError) {
			console.error(allowanceRes.unwrapErr());
			toast.error(allowanceRes.unwrapErr().shortMessage);
			return;
		}

		value = allowanceRes.unwrap().toString();
	};
</script>

<Modal title="Transfer from" on:close>
	<Input label="From address" bind:value={fromAddress} error={fromAddressErr} />
	<Input label="To address" className="mt-2" bind:value={toAddress} error={toAddressErr} />
	<Input label="Value" className="mt-2" bind:value error={valueErr} />

	<MaxValueButton className="mt-2" on:click={onMaxClick} />

	<div class="flex gap-3 mt-4">
		<Button
			className="flex-grow"
			disabled={!!valueErr || !!fromAddressErr || !!toAddressErr}
			on:click={onTransferClick}
		>
			TRANSFER
		</Button>

		<Button type="secondary" on:click={() => dispatch('close')}>CANCEL</Button>
	</div>
</Modal>
