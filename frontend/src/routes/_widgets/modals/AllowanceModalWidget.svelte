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
	import AccountBalance from '@src/routes/_components/AccountBalance.svelte';

	// store
	const globalStore = getGlobalStore();
	const contractActions = new ContractActions(globalStore);

	// state
	let owner = '';
	let allowance: bigint | undefined = undefined;

	const dispatch = createEventDispatcher();

	// computed
	$: ownerErr = isAddress(owner) ? '' : 'Invalid address';

	// event handlers
	const onGetAllowanceClick = async () => {
		const res = await contractActions.allowance(owner);

		if (res.isError) {
			console.error(res.unwrapErr());
			toast.error(res.unwrapErr().shortMessage, {
				position: 'top-center',
			});

			return;
		}

		allowance = res.unwrap();
	};
</script>

<Modal title="Allowance" on:close>
	<Input label="Owner" bind:value={owner} error={ownerErr} />

	{#if allowance !== undefined}
		<AccountBalance className="mt-3" balance={allowance} />
	{/if}

	<div class="flex gap-3 mt-4">
		<Button className="flex-grow" disabled={!!ownerErr} on:click={onGetAllowanceClick}>
			REQUEST
		</Button>

		<Button type="secondary" on:click={() => dispatch('close')}>CANCEL</Button>
	</div>
</Modal>
