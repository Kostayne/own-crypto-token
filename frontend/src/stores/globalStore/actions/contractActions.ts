import { get } from "svelte/store";
import { toResultAsync } from "base-ts-result";

// actions
import { GlobalStoreActions } from "../globalStoreActions";

// types
import type { AppContract } from "@t/appContract.type";

export class ContractActions extends GlobalStoreActions {
    async getBalance(): Promise<bigint> {
        const globalState = get(this.store);

        if (!globalState?.walletState?.contract) {
            console.error('Tried to get balance without a contract instance');
            return BigInt(0);
        }
        
        const selectedWallet = globalState.walletState.selectedWallet;
        const contract = globalState.walletState.contract as AppContract;

        const res = await toResultAsync(() => 
            contract.balanceOf(selectedWallet.address)
        );

        if (res.isError) {
            console.error(res.unwrapErr());
            return BigInt(0);
        }

        return res.unwrap();
    }
}