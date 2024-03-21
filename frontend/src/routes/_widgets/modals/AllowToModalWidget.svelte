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

	// utils
	import { fetchBalanceOrShowErr } from '@utils/fetchBalance';

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
	const onAllowClick = async () => {
		const val = parseInt(value);
		const balance = await fetchBalanceOrShowErr(contractActions);

		// prevent approving insufficient balance
		if (BigInt(val) < balance || balance === BigInt(0)) {
			toast.error('Not enough balance', { position: 'top-center' });
			valueErr = 'Too much';
			return;
		}

		const res = await contractActions.allowTo(address, val);

		if (res.isError) {
			console.error(res.unwrapErr());
			toast.error(res.unwrapErr().shortMessage, {
				position: 'top-center',
			});
		}
	};

	const onMaxClick = async () => {
		const balance = await fetchBalanceOrShowErr(contractActions);
		value = balance.toString();
	};
</script>

<Modal title="Allow to" on:close>
	<Input label="To address" bind:value={address} error={addressErr} />
	<Input label="Value" className="mt-2" bind:value error={valueErr} />

	<MaxValueButton className="mt-2" on:click={onMaxClick} />

	<div class="flex gap-3 mt-4">
		<Button className="flex-grow" disabled={!!valueErr || !!addressErr} on:click={onAllowClick}>
			ALLOW
		</Button>

		<Button type="secondary" on:click={() => dispatch('close')}>CANCEL</Button>
	</div>
</Modal>
