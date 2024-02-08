<script>
    import { gs } from 'get-module-style';

    // props
    export let className = '';

    // c
    import TransferFromButton from './buttons/TransferFromButton.svelte';
    import TransferButton from './buttons/TransferButton.svelte';
    import AllowToButton from './buttons/AllowToButton.svelte';
    import AllowanceButton from './buttons/AllowanceButton.svelte';
    import BalanceOfButton from './buttons/BalanceOfButton.svelte';
</script>

<div 
    class={gs(
        className,
        'max-w-[230px] mx-auto flex flex-wrap justify-center gap-x-3 gap-y-3'
    )}
>
    <TransferButton />
    <TransferFromButton />
    <AllowToButton />
    <AllowanceButton />
    <BalanceOfButton />
</div>