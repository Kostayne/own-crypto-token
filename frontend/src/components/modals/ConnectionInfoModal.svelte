<script>
	import { createEventDispatcher } from 'svelte';

	// c
	import Modal from '@c/Modal.svelte';
	import ConnectionInfoCard from '@c/cards/ConnectionInfoCard.svelte';

	const dispatch = createEventDispatcher();
</script>

<Modal on:close>
	<ConnectionInfoCard on:save on:cancel={() => dispatch('close')} />
</Modal>
