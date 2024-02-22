<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Wallet } from 'ethers';

	// c
	import Button from '@c/buttons/Button.svelte';
	import TextButton from '@c/buttons/TextButton.svelte';
	import WordsList from './components/WordsList.svelte';
	import MnemonicsWarningModal from './components/MnemonicsWarningModal.svelte';

	// types
	import { getInitStore } from '@ctx/getInitStore';

	// state
	let generatedWords: string[] = [];

	// before generating new address, we need to show a modal to user,
	let isShowingMnemonicsWarning = false;

	const initDataStore = getInitStore();

	onMount(() => {
		// generating an hd wallet
		const generatedWallet = Wallet.createRandom();

		if (!generatedWallet.mnemonic) {
			throw new Error('Generated a wallet without mnemonic!');
		}

		// setting mnemonics words
		generatedWords = generatedWallet.mnemonic.phrase.split(' ');

		// showing mnemonics warning if needed
		const key = 'kreepto_showed_mnemonics_warning';

		if (sessionStorage.getItem(key) !== 'true') {
			sessionStorage.setItem(key, 'true');
			isShowingMnemonicsWarning = true;
		}
	});

	function onGenerateNewAddressClick() {
		// in case that we actually did not generate a wallet
		if (generatedWords?.length !== 12) {
			throw new Error('Generated words length invalid!');
		}

		// saving seed phrase as str in context
		initDataStore.set({ seedPhrase: generatedWords.join(' ') });

		// redirecting to set password step
		goto('/welcome/set_password');
	}
</script>

<svelte:head>
	<title>Generate new address</title>
</svelte:head>

{#if generatedWords.length > 0}
	<WordsList className="mx-auto mb-6" addresses={generatedWords} />
{/if}

{#if isShowingMnemonicsWarning}
	<MnemonicsWarningModal on:close={() => (isShowingMnemonicsWarning = false)} />
{/if}

<Button className="mx-auto w-full max-w-[280px]" on:click={onGenerateNewAddressClick}>
	Continue with generated address
</Button>

<a class="mx-auto w-fit" href="/welcome/import_address">
	<TextButton className="mt-3">Import existing</TextButton>
</a>
