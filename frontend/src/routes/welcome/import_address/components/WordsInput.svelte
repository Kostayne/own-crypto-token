<script lang="ts">
	import { gs } from 'get-module-style';
	import { onMount, createEventDispatcher } from 'svelte';

	// c
	import Select from 'svelte-select';

	// types
	type ValidationErrType = 'non_alphabetical_character' | 'empty_string' | 'too_long';

	interface ValidationInfo {
		errType: ValidationErrType;
		wordIndices: Set<number>;
	}

	// props
	export let className = '';

	const dispatchEvent = createEventDispatcher();

	// external state
	export let words: string[] = new Array(12).fill('');

	// -- INTERNAL STATE --
	let selectedWordsCountOption = { value: '12', label: '12' };

	// need for fast word highlight
	let invalidWordIndices = new Set<Number>();

	// needed for fast error msg generation
	let validationErrors: ValidationInfo[] = [
		{
			errType: 'empty_string',
			wordIndices: new Set(),
		},

		{
			errType: 'non_alphabetical_character',
			wordIndices: new Set(),
		},

		{
			errType: 'too_long',
			wordIndices: new Set(),
		},
	];

	// dom refs
	let inputElements: HTMLInputElement[] = [];

	// -- PRIVATE METHODS --
	function validateAllWords() {
		// clear prev data
		clearAllValidationErrors();

		// validating
		for (let i = 0; i < words.length; i++) {
			validateInput(i);
		}

		// sending result to parent
		dispatchValidated();
	}

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

		// splitting str by space, rm colons
		const pastedWords = pasteStr.split(' ').map((w) => w.replaceAll(',', ''));

		for (let i = 0; i < pastedWords.length; i++) {
			// checking bounds
			if (inputIndex + i >= words.length) {
				break;
			}

			// setting word
			const word = pastedWords[i];
			words[inputIndex + i] = word;

			// validating it
			validateInput(inputIndex + i);
		}

		// finding & focusing the last affected input
		const i = Math.min(inputIndex + pastedWords.length - 1, words.length - 1);
		inputElements[i].focus();

		// telling parent component validation result
		dispatchValidated();
	}

	function onWordsCountChange() {
		words.length = parseInt(selectedWordsCountOption.value);
		words = words.map((w) => w || '');

		validateAllWords();
	}

	/**
	 * @description returns isOk & errors, also updates ui
	 */
	function validateInput(index: number) {
		// checking is index in bounds
		if (index >= words.length || index < 0) {
			throw new Error('Index is out of bounds!');
		}

		// clear old validation results
		clearWordValidationErrors(index);
		invalidWordIndices.delete(index);

		const word = words[index] || '';

		// empty str check
		if (word.length === 0) {
			addWordValidationError(index, 'empty_string');
			invalidWordIndices.add(index);
		}

		// max length check
		if (word.length > 8) {
			addWordValidationError(index, 'too_long');
			invalidWordIndices.add(index);
		}

		// non-alphabetical characters check
		if (/[^a-zA-Z]/.test(word)) {
			addWordValidationError(index, 'non_alphabetical_character');
			invalidWordIndices.add(index);
		}

		// forcing svelte's reactivity to work
		invalidWordIndices = invalidWordIndices;
		validationErrors = validationErrors;

		return !invalidWordIndices.has(index);
	}

	function clearAllValidationErrors() {
		invalidWordIndices.clear();

		validationErrors.forEach((ve) => {
			ve.wordIndices.clear();
		});
	}

	function clearWordValidationErrors(index: number) {
		validationErrors.forEach((v) => {
			v.wordIndices.delete(index);
		});
	}

	function addWordValidationError(index: number, errType: ValidationErrType) {
		const ve = validationErrors.find((ve) => ve.errType === errType);

		if (!ve) {
			throw new Error(`Could not find info with provided err type: ${errType}`);
		}

		ve.wordIndices.add(index);
	}

	const dispatchValidated = () => {
		dispatchEvent('validated', invalidWordIndices.size === 0);
	};

	// hooks
	onMount(() => {
		validateAllWords();
	});
</script>

<div class={gs(className, '')}>
	<!-- Words count input -->
	<div class="flex mx-auto w-fit items-center gap-2">
		<span>I have</span>

		<Select
			items={[12, 24]}
			bind:value={selectedWordsCountOption}
			on:change={() => onWordsCountChange()}
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
					on:paste={(e) => onPaste(e, i)}
					on:input={() => {
						validateInput(i);
						dispatchValidated();
					}}
					class={gs(
						`w-[80px] border rounded p-1`,
						`${invalidWordIndices.has(i) ? 'border-red-500 outline-red-500' : 'border-primary outline-primary'}`,
					)}
				/>
			</div>
		{/each}
	</div>

	<!-- validation errors -->
	<div class={gs('flex flex-col')}></div>
</div>
