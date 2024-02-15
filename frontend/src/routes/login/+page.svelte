<script lang="ts">
	import Button from '@c/Button.svelte';
	import Input from '@c/Input.svelte';
	import WelcomeText from '@c/WelcomeText.svelte';

	let password = '';
</script>

<WelcomeText />

<main class="flex flex-col items-stretch max-w-[280px]">
	<p class="mt-5 text-center">Unlock the wallet with your password</p>

	<Input
		autocomplete="current-password"
		type="password"
		className="mt-6"
		label="Password"
		value={password}
	/>

	<Button className="mt-3">Login</Button>
</main>
