<script lang="ts">
	import { gs } from 'get-module-style';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';

	// c
	import Modal from '@c/Modal.svelte';
	import Button from '@c/buttons/Button.svelte';

	// types
	import type { EstablishConnectionErrT } from '@t/errors/establishConnectionError.type';

	// props
	export let errorType: EstablishConnectionErrT;

	const dispatch = createEventDispatcher();

	const getErrMsg = (): string => {
		switch (errorType) {
			case 'PROVIDER_ERR':
				return 'Failed to create a provider, did you type valid values?';
			case 'SIGNER_ERR':
				return 'Failed to create a signer, is all ok with your wallet?';
			case 'CONTRACT_ERR':
				return "Failed to create a wallet instance, nothing you can do. It's a deploy problem.";
			default:
				return 'Unhandled error, my bad!';
		}
	};

	$: showSettingsBtn = errorType !== 'CONTRACT_ERR';
</script>

<Modal title="CONNECTION FAILED" type="error" on:close>
	<div class="flex flex-col min-h-[125px]">
		<p>{getErrMsg()}</p>

		<div class={gs('flex mt-auto gap-x-3')}>
			{#if showSettingsBtn}
				<Button
					className={gs('flex-grow')}
					on:click={() => {
						goto('/settings');
						dispatch('close');
					}}
				>
					SETTINGS
				</Button>
			{/if}

			<Button
				className={gs(showSettingsBtn ? 'w-[75px]' : '')}
				type="secondary"
				on:click={() => {
					dispatch('close');
				}}
			>
				OK
			</Button>
		</div>
	</div>
</Modal>
