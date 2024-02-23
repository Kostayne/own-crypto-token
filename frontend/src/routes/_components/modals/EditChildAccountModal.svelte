<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// c
	import Input from '@c/Input.svelte';
	import Modal from '@c/Modal.svelte';
	import Button from '@c/buttons/Button.svelte';
	import TextButton from '@c/buttons/TextButton.svelte';

	// ctx
	import { getGlobalStore } from '@ctx/getGlobalStore';

	// validators
	import { validateAccountName } from '@validators/accountNameValidator';
	import { GlobalStoreActions } from '@stores/globalStore/globalStoreActions';

	// props
	export let address: string;

	// global state
	const globalStore = getGlobalStore();

	// local state
	let name = '';
	let nameErr = validateAccountName('', []);

	const dispatch = createEventDispatcher();
	const storeActions = new GlobalStoreActions(globalStore);

	// event handlers
	function onEditClick() {
		storeActions.editAccount(address, name);
		dispatch('close');
	}
</script>

<Modal on:close title="Edit account">
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

	<!-- buttons -->
	<div class="flex items-center mt-4">
		<Button disabled={Boolean(nameErr)} on:click={onEditClick}>EDIT</Button>

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
