<script lang="ts">
	import { gs } from 'get-module-style';

	export let className = '';
</script>

<div class={gs('rounded-[8px] p-4 bg-white', 'flex items-center flex-col shadow-md', className)}>
	<slot />
</div>
