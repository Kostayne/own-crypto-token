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
	let addr = '';

	const dispatch = createEventDispatcher();

	// computed
	$: addrErr = isAddress(addr) ? '' : 'Invalid address';

	// event handlers
	const onChangeClick = async () => {
		const res = await contractActions.addAdmin(addr);

		if (res.isError) {
			console.error(res.unwrapErr());
			toast.error(res.unwrapErr().shortMessage, {
				position: 'top-center',
			});

			return;
		}

		toast.success('Changed the contract owner');
		dispatch('close');
	};
</script>

<Modal title="Change the contract owner" on:close>
	<Input label="Address" bind:value={addr} error={addrErr} />

	<div class="flex gap-3 mt-4">
		<Button className="flex-grow" type="error" disabled={!!addrErr} on:click={onChangeClick}>
			Change
		</Button>

		<Button type="secondary" on:click={() => dispatch('close')}>CANCEL</Button>
	</div>
</Modal>
