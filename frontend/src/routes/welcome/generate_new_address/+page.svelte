<script lang="ts">
	import { onMount } from 'svelte';

	// utils
	import { generateMnemonicWords } from './utils/generateMnemonicWords';

	// c
	import Button from '@c/Button.svelte';
	import TextButton from '@c/TextButton.svelte';
	import WordsList from './components/WordsList.svelte';
	import MnemonicsWarningModal from './components/MnemonicsWarningModal.svelte';

	// state
	let generatedWords = generateMnemonicWords();

	// before generating new address, we need to show a modal to user,
	let isShowingMnemonicsWarning = false;

	onMount(() => {
		// showing mnemonics warning
		const key = 'kreepto_showed_mnemonics_warning';

		if (sessionStorage.getItem(key) !== 'true') {
			sessionStorage.setItem(key, 'true');
			isShowingMnemonicsWarning = true;
		}
	});

	function onGenerateNewAddressClick() {
		// TODO complete new address setup
		alert('Done!');
	}
</script>

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
