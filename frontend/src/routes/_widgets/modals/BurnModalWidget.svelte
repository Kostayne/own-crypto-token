<script lang="ts">
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

	const dispatch = createEventDispatcher();

	// computed
	$: valueErr = validateTransferValue(value);

	// event handlers
	const onBurnClick = async () => {
		const val = parseInt(value);
		const res = await contractActions.burn(val);

		if (res.isError) {
			console.error(res.unwrapErr());
			toast.error(res.unwrapErr().shortMessage, {
				position: 'top-center',
			});

			return;
		}

		toast.success(`Successfully burnt ${val} ${tokenSymbol}`);
		dispatch('close');
	};
</script>

<Modal title="Burn" on:close>
	<Input label="Value" className="mt-2" bind:value error={valueErr} />

	<div class="flex gap-3 mt-4">
		<Button className="flex-grow" disabled={!!valueErr} on:click={onBurnClick}>Burn</Button>

		<Button type="secondary" on:click={() => dispatch('close')}>CANCEL</Button>
	</div>
</Modal>
