<script lang="ts">
	import Button from '@c/Button.svelte';
	import TextButton from '@c/TextButton.svelte';
	import WordsInput from './_components/WordsInput.svelte';

	let importedWordsAreValid = false;
	let importedWords: string[] = new Array(12).fill('');

	// component refs
	let wordsInputRef: WordsInput;

	function onImportExistingClick() {
		// valid case
		alert('Importing address...');
	}
</script>

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
