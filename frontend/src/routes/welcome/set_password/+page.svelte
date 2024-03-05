<script lang="ts">
	import { onMount } from 'svelte';

	// c
	import Input from '@c/Input.svelte';
	import Button from '@c/buttons/Button.svelte';

	// utils
	import { validatePassword, validatePasswordConfirm } from '@validators/passwordValidator';

	// ctx
	import { getInitStore } from '@ctx/getInitStore';
	import { getGlobalStore } from '@ctx/getGlobalStore';
	import { AuthActions } from '@stores/globalStore/authActions';
	import { useAuth } from '@hooks/useAuth';

	// state
	let password = '';
	let passwordErr = '';
	let confirm = '';
	let confirmErr = '';

	const initDataStore = getInitStore();
	const globalStore = getGlobalStore();

	const authActions = new AuthActions(globalStore);

	// event listeners
	async function onSetPasswordClick() {
		// validation check
		if (passwordErr || confirmErr) {
			return;
		}

		const res = authActions.register(initDataStore, password);

		// all ok, quit
		if (!res.isError) {
			return;
		}

		// handling err
		const err = res.unwrapErr();

		if (err === 'INVALID_SEED') {
			alert('Your seed is invalid!');
		}

		if (err === 'FAILED_TO_SAVE') {
			alert('Failed to save!');
		}
	}

	// hooks
	useAuth('init');

	onMount(() => {
		passwordErr = validatePassword('');
		confirmErr = validatePasswordConfirm('', '');
	});
</script>

<svelte:head>
	<title>Set Kreepto password</title>
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
