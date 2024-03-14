<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	// c
	import WelcomeText from '@c/WelcomeText.svelte';
	import type { InitData } from '@stores/initStore/initData.type';

	// create initData store & ctx
	const initData = writable<InitData>({});
	setContext('initData', initData);
</script>

<WelcomeText />

<main>
	<div class="flex flex-col mt-5">
		<slot />
	</div>
</main>
