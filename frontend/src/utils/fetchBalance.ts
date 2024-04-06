import toast from 'svelte-french-toast';
import type { ContractActions } from '@stores/globalStore';

export const fetchBalanceOrShowErr = async (contractActions: ContractActions) => {
	const balanceRes = await contractActions.getBalance();

	if (balanceRes.isError) {
		console.error(balanceRes.unwrapErr());
		toast.error(balanceRes.unwrapErr().shortMessage);
	}

	return balanceRes.unwrapOr(BigInt(0));
};
