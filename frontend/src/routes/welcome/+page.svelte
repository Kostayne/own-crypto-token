<script lang="ts">
	// utils
	import { generateMnemonicWords } from './_utils/generateMnemonicWords';

	// c
	import Button from '@c/Button.svelte';
	import TextButton from '@c/TextButton.svelte';
	import WordsList from './_components/WordsList.svelte';
	import MnemonicsWarningModal from './_components/MnemonicsWarningModal.svelte';
	import WordsInput from './_components/WordsInput.svelte';

	let isImportingAddress = false;
	let generatedWords: string[] = [];
	let isShowingMnemonicsWarning = false;

	$: newAddressBtnText = generatedWords.length > 0 ? 'Continue' : 'Continue with new address';

	function onGenerateNewAddressClick() {
		// show warning & generate mnemonics if there are none
		if (generatedWords.length === 0) {
			generatedWords = generateMnemonicWords();
			isShowingMnemonicsWarning = true;
			isImportingAddress = false;
			return;
		}

		// final part
		// TODO complete new address setup
		alert('Done!');
	}

	function onImportExistingClick() {
		generatedWords.length = 0;
		isImportingAddress = true;
	}
</script>

<main>
	<h1 class="w-fit mx-auto text-[23px] font-medium">
		Welcome to <span class="text-primary">Kreepto</span>
	</h1>

	<!-- content -->
	<div class="flex flex-col mt-5">
		<!--  -->
		{#if generatedWords.length > 0}
			<WordsList className="mx-auto mb-6" addresses={generatedWords} />
		{/if}

		{#if isImportingAddress}
			<WordsInput className="mb-6" />
		{/if}

		{#if isShowingMnemonicsWarning}
			<MnemonicsWarningModal on:close={() => (isShowingMnemonicsWarning = false)} />
		{/if}

		<Button className="mx-auto w-full max-w-[280px]" on:click={onGenerateNewAddressClick}>
			{newAddressBtnText}
		</Button>

		<TextButton on:click={onImportExistingClick} className="mt-3">Import existing</TextButton>
	</div>
</main>
