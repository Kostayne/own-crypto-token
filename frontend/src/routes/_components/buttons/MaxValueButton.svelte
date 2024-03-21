<script lang="ts">
	import { gs } from 'get-module-style';

	// c
	import Button from '@c/buttons/Button.svelte';

	// props
	export let className = '';
</script>

<Button type="alternative" className={gs(className, 'py-[4px] px-3 !font-medium')} on:click>
	max
</Button>
