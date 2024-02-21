<script>
	import { gs } from 'get-module-style';

	// c
	import IconButton from '@c/buttons/RoundIconButton.svelte';
	import AddSvg from '@icons/add.svg?component';

	export let className = '';
</script>

<IconButton className={gs(className)} color="blue">
	<AddSvg />
</IconButton>
