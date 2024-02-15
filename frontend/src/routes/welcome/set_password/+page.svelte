<script lang="ts">
	import { getContext, onMount } from 'svelte';

	// c
	import Input from '@c/Input.svelte';
	import Button from '@c/Button.svelte';

	// types
	import type { InitData } from '@t/initData.type';

	// utils
	import { validatePassword, validatePasswordConfirm } from '@utils/passwordValidator';
	import { goto } from '$app/navigation';

	// state
	let password = '';
	let passwordErr = '';
	let confirm = '';
	let confirmErr = '';

	const initData: InitData = getContext('initData');

	// event listeners
	function onSetPasswordClick() {
		// validation check
		if (passwordErr || confirmErr) {
			return;
		}

		// if some how we not have seed phrase redirect user
		if (!initData.seedPhrase) {
			goto('/welcome');
		}

		// saving password
		initData.password = password;

		// TODO encrypt seed phrase
		// TODO generate wallet info
		// TODO redir user to home page
	}

	// hooks
	onMount(() => {
		// seed phrase must be already set, otherwise redirect user
		if (!initData.seedPhrase) {
			goto('/welcome');
		}

		passwordErr = validatePassword('');
		confirmErr = validatePasswordConfirm('', '');
	});
</script>

<svelte:head>
	<title>Set Kreepto pass</title>
</svelte:head>

<main class="mx-auto max-w-[280px] flex flex-col">
	<p class="text-center">Create a password that will secure your seed phrase</p>

	<Input
		type="password"
		error={passwordErr}
		className="mt-6"
		value={password}
		label="Password"
		autocomplete="new-password"
		on:change={(e) => {
			password = e.detail;
			passwordErr = validatePassword(e.detail);

			// have to revalidate confirm, since it depends on password
			confirmErr = validatePasswordConfirm(confirm, password);
		}}
	/>

	<Input
		type="password"
		error={confirmErr}
		className="mt-3"
		value={confirm}
		label="Repeat password"
		autocomplete="new-password"
		on:change={(e) => {
			confirm = e.detail;
			confirmErr = validatePasswordConfirm(e.detail, password);
		}}
	/>

	<Button disabled={!!(confirmErr || passwordErr)} on:click={onSetPasswordClick} className="mt-4">
		Continue
	</Button>
</main>
