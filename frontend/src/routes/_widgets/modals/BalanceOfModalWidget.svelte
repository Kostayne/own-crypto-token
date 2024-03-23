<script lang="ts">
	import { isAddress } from 'ethers';
	import { createEventDispatcher } from 'svelte';
	import toast from 'svelte-french-toast';

	// c
	import Input from '@c/Input.svelte';
	import Modal from '@c/Modal.svelte';
	import Button from '@c/buttons/Button.svelte';

	import AccountBalance from '../../_components/AccountBalance.svelte';

	// stores
	import { ContractActions, getGlobalStore } from '@stores/globalStore';

	// state
	let address = '';
	let balance = BigInt(0);

	// store
	const globalStore = getGlobalStore();
	const contractActions = new ContractActions(globalStore);

	// events
	const dispatch = createEventDispatcher();

	// event handlers
	const onGetBalanceClick = async () => {
		const resp = await contractActions.balanceOf(address);

		if (resp.isError) {
			toast.error(resp.unwrapErr().shortMessage, {
				position: 'top-center',
			});

			console.error(resp.unwrapErr());
		}

		balance = resp.unwrap();
	};

	// computed
	$: addressErr = isAddress(address) ? '' : 'Invalid address';
</script>

<Modal title="Balance of" on:close>
	<Input error={addressErr} label="Address" bind:value={address} />

	{#if balance}
		<AccountBalance className="mt-2" {balance} />
	{/if}

	<div class="mt-4 flex justify-stretch gap-3">
		<Button
			className="w-full text-nowrap"
			disabled={Boolean(addressErr)}
			on:click={onGetBalanceClick}
		>
			Get balance
		</Button>

		<Button className="w-full" type="secondary" on:click={() => dispatch('close')}>Close</Button>
	</div>
</Modal>
