<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	// c
	import Modal from '@c/Modal.svelte';
	import AccountPreview from '@c/AccountPreview.svelte';
	import CreateAccountButton from './buttons/CreateAccountButton.svelte';
	import Button from '@c/buttons/Button.svelte';

	// fixtures
	import { accountPreviewsFixture } from '../../fixtures/accountPreviews.fixture';

	// types
	import type { AccountPreviewData } from '@t/accountPreviewData.type';
	import type { EncryptedData } from '@t/encryptedData.type';

	// state
	const encrypted = getContext<Writable<EncryptedData>>('encrypted');
	let previews: AccountPreviewData[] = accountPreviewsFixture;

	const dispatch = createEventDispatcher();
</script>

<Modal formClassName="w-[300px]" title="Accounts">
	<div class="flex flex-col gap-y-2 w-full">
		{#each previews as p}
			<AccountPreview className="w-full" data={p} manageable />
		{/each}
	</div>

	<CreateAccountButton className="mt-3 mr-auto" />

	<Button
		className="mt-4 w-full"
		on:click={() => {
			dispatch('closed');
		}}
	>
		OK
	</Button>
</Modal>
