<script lang="ts">
	import { gs } from 'get-module-style';

	// c
	import Select from 'svelte-select';

	// props
	export let className = '';

	// state
	let wordsCount = { value: '12', label: '12' };
	const wordCountOptions = [12, 24];
	const words: string[] = [];

	let inputElements: HTMLInputElement[] = [];

	// computed
	$: words.length = parseInt(wordsCount.value);

	function onPaste(e: ClipboardEvent, inputIndex: number) {
		e.preventDefault();

		// checking input index
		if (inputIndex >= words.length || inputIndex < 0) {
			throw new Error('Input index is out of bounds');
		}

		// getting pasted str
		const pasteStr = e.clipboardData?.getData('text').trim() || '';

		// not handling empty str
		if (pasteStr === '') {
			return;
		}

		// splitting by space
		const pastedWords = pasteStr.split(' ');

		for (let i = 0; i < pastedWords.length; i++) {
			// checking bounds
			if (inputIndex + i >= words.length) {
				break;
			}

			const word = pastedWords[i];
			words[inputIndex + i] = word;
		}

		// finding & focusing the last affected input
		const i = Math.min(inputIndex + pastedWords.length - 1, words.length - 1);
		inputElements[i].focus();
	}
</script>

<div class={gs(className, '')}>
	<!-- Words count input -->
	<div class="flex mx-auto w-fit items-center gap-2">
		<span>I have</span>

		<Select
			items={wordCountOptions}
			bind:value={wordsCount}
			clearable={false}
			searchable={false}
			--width="60px"
			--padding="0px 0px 0px 8px"
			--value-container-padding="0"
			--item-padding="0 0 0 8px"
			--selected-item-padding="0"
		/>

		<span>words secret key</span>
	</div>

	<!-- words list -->
	<div class="mt-4 w-fit mx-auto grid grid-cols-2 xsm2:grid-cols-3 gap-3 justify-items-end">
		{#each words as word, i}
			<div class="flex items-center gap-2">
				<span>{i + 1}</span>

				<input
					bind:value={word}
					bind:this={inputElements[i]}
					class="w-[80px] border-primary border rounded p-1"
					on:paste={(e) => onPaste(e, i)}
				/>
			</div>
		{/each}
	</div>
</div>
