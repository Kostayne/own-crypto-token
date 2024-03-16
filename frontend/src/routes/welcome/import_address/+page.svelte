<script lang="ts">
	import { Mnemonic } from 'ethers';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';

	// c
	import Button from '@c/buttons/Button.svelte';
	import TextButton from '@c/buttons/TextButton.svelte';
	import WordsInput from './components/WordsInput.svelte';

	// ctx
	import { getInitStore } from '@stores/initStore/initStore.selector';

	// state
	let importedWordsAreValid = false;
	let importedWords: string[] = new Array(12).fill('');

	const initDataStore = getInitStore();

	// component refs
	let wordsInputRef: WordsInput;

	function onImportExistingClick() {
		// user can enable btn with inspector, so additional check is useful
		if (!importedWordsAreValid) {
			return;
		}

		// creating a wallet from a seed phrase
		const seedPhrase = importedWords.join(' ');

		// validating seed phrase
		if (!Mnemonic.isValidMnemonic(seedPhrase)) {
			toast.error('Your seed phrase is not valid!', {
				position: 'top-center',
			});

			return;
		}

		// saving seed phrase
		initDataStore.set({ seedPhrase });

		// redirecting to set pass phase
		goto('/welcome/set_password');
	}
</script>

<svelte:head>
	<title>Import address</title>
</svelte:head>

<main class="flex flex-col w-full">
	<WordsInput
		on:validated={(e) => {
			importedWordsAreValid = e.detail;
		}}
		bind:this={wordsInputRef}
		words={importedWords}
		className="mb-6"
	/>

	<Button
		disabled={!importedWordsAreValid}
		className="mx-auto w-full max-w-[280px]"
		on:click={onImportExistingClick}
	>
		Continue
	</Button>

	<a class="w-fit mx-auto" href="/welcome/generate_new_address">
		<TextButton className="mt-3">Generate new address</TextButton>
	</a>
</main>
