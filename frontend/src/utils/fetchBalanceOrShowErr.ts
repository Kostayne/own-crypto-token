import toast from 'svelte-french-toast';
import type { ContractActions } from '@stores/globalStore';

export const fetchBalanceOrShowErr = async (contractActions: ContractActions) => {
    const balanceRes = await contractActions.getBalance();

    if (balanceRes.isError) {
        const err = balanceRes.unwrapErr();
        const errMsg = err.shortMessage || 'Failed to fetch balance';
        console.error(err);
        toast.error(errMsg);
    }

    return balanceRes.unwrapOr(BigInt(0));
};
