<script>
    import { gs } from 'get-module-style';

    // props
    export let className = '';

    // c
    import AddToWhiteListButton from './buttons/AddToWhiteListButton.svelte';
	import RmFromWhiteListButton from './buttons/RmFromWhiteListButton.svelte';
	import AddAdminButton from './buttons/AddAdminButton.svelte';
	import RmAdminButton from './buttons/RmAdminButton.svelte';
	import PauseButton from './buttons/PauseButton.svelte';
	import ContinueButton from './buttons/ContinueButton.svelte';
	import EmitButton from './buttons/EmitButton.svelte';
	import BurnButton from './buttons/BurnButton.svelte';
	import ChangeOwnerButton from './buttons/ChangeOwnerButton.svelte';
</script>

<div 
    class={gs(
        className,
        'max-w-[250px] mx-auto flex flex-wrap justify-center gap-x-3 gap-y-3'
    )}
>
    <AddToWhiteListButton />
    <RmFromWhiteListButton />
    <AddAdminButton />
    <RmAdminButton />
    <PauseButton />
    <ContinueButton />
    <EmitButton />
    <BurnButton />
    <ChangeOwnerButton />
</div>