<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// c
	import Button from '@c/Button.svelte';
	import Modal from '@c/Modal.svelte';

	const dispatch = createEventDispatcher();
</script>

<Modal title="WARNING" type="warning" formClassName="!max-w-[350px]">
	<p>Write down generated keys, if you lose them all funds will be lost!</p>

	<Button disableTime={3} on:click={() => dispatch('close')} className="mt-6 w-full" type="warning">
		GOT IT
	</Button>
</Modal>
