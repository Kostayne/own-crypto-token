<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onMount } from 'svelte';

	// utils
	import { generateMnemonicWords } from './utils/generateMnemonicWords';

	// c
	import Button from '@c/Button.svelte';
	import TextButton from '@c/TextButton.svelte';
	import WordsList from './components/WordsList.svelte';
	import MnemonicsWarningModal from './components/MnemonicsWarningModal.svelte';

	// types
	import type { InitData } from '@t/initData.type';

	// state
	let generatedWords = generateMnemonicWords();

	// before generating new address, we need to show a modal to user,
	let isShowingMnemonicsWarning = false;

	const initData: InitData = getContext('initData');

	onMount(() => {
		// showing mnemonics warning
		const key = 'kreepto_showed_mnemonics_warning';

		if (sessionStorage.getItem(key) !== 'true') {
			sessionStorage.setItem(key, 'true');
			isShowingMnemonicsWarning = true;
		}
	});

	function onGenerateNewAddressClick() {
		// in case that we actually did not generate any words
		if (generatedWords.length !== 12) {
			return;
		}

		// saving seed phrase as str
		initData.seedPhrase = generatedWords.join(' ');

		// redirecting to set password step
		goto('/welcome/set_password');
	}
</script>

<svelte:head>
	<title>Generate new address</title>
</svelte:head>

<WordsList className="mx-auto mb-6" addresses={generatedWords} />

{#if isShowingMnemonicsWarning}
	<MnemonicsWarningModal on:close={() => (isShowingMnemonicsWarning = false)} />
{/if}

<Button className="mx-auto w-full max-w-[280px]" on:click={onGenerateNewAddressClick}>
	Continue with generated address
</Button>

<a class="mx-auto w-fit" href="/welcome/import_address">
	<TextButton className="mt-3">Import existing</TextButton>
</a>
