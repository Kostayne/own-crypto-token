<script lang="ts">
	// c
	import Button from '@c/buttons/Button.svelte';
	import TextButton from '@c/buttons/TextButton.svelte';
</script>

<svelte:head>
	<title>Welcome to Kreepto!</title>
</svelte:head>

<!-- Just links to action pages -->
<main class="flex flex-col w-full">
	<a href="/welcome/generate_new_address">
		<Button className="mx-auto w-full max-w-[280px]">Generate new address</Button>
	</a>

	<a class="w-fit mx-auto" href="/welcome/import_address">
		<TextButton className="mt-3">Import existing</TextButton>
	</a>
</main>
