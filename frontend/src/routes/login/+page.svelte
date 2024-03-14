<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	// c
	import Button from '@c/buttons/Button.svelte';
	import Input from '@c/Input.svelte';
	import WelcomeText from '@c/WelcomeText.svelte';

	// validators
	import { validatePassword } from '@validators/passwordValidator';

	// stores
	import { getGlobalStore } from '@stores/globalStore/globalStore.selector';
	import { AuthActions } from '@stores/globalStore/actions/authActions';

	// hooks
	import { useAuth } from '@hooks/useAuth';

	// state
	let password = '';
	let passwordErr = '';

	// global state
	const globalStore = getGlobalStore();
	const authActions = new AuthActions(globalStore);

	// hooks
	useAuth('registered');

	onMount(() => {
		passwordErr = validatePassword('');
	});

	// event handlers
	async function onLoginClick() {
		// just an additional validation check (more safe)
		if (passwordErr) {
			return;
		}

		const dest = $page.url.searchParams.get('dest') || '/';

		const res = authActions.login(password, dest);
		{
			if (res.isError && res.unwrapErr() === 'INVALID_PASSWORD') {
				passwordErr = 'Invalid password';
			}
		}
	}
</script>

<WelcomeText />

<main class="mx-auto max-w-[280px] flex flex-col items-stretch">
	<p class="mt-5 text-center">Unlock the wallet with your password</p>

	<Input
		type="password"
		className="mt-6"
		label="Password"
		value={password}
		error={passwordErr}
		autocomplete="current-password"
		on:change={(e) => {
			password = e.detail;
			passwordErr = validatePassword(e.detail);
		}}
	/>

	<Button on:click={onLoginClick} className="mt-3" disabled={!!passwordErr}>Login</Button>
</main>
