import { get } from "svelte/store";
import { toResultAsync } from "base-ts-result";
import type { AddressLike } from "ethers";
import toast from "svelte-french-toast";

// actions
import { GlobalStoreActions } from "../globalStoreActions";

// types
import type { AppContract } from "@t/appContract.type";

export class ContractActions extends GlobalStoreActions {
    /**
     * @description Get balance of the provided address
     * @param address Address string
     * @returns Bigint balance
     */
    async balanceOf(address: AddressLike): Promise<bigint> {
        const globalState = get(this.store);

        if (!globalState?.walletState?.contract) {
            console.error('Tried to get balance without a contract instance');
            return BigInt(0);
        }
        
        const contract = globalState.walletState.contract as AppContract;

        const res = await toResultAsync(() => 
            contract.balanceOf(address)
        );

        if (res.isError) {
            console.error(res.unwrapErr());
            toast.error('Failed to get balance');
            return BigInt(0);
        }

        return res.unwrap();
    }

    /**
     * @description Get balance of the current wallet
     * @returns Balance BigInt
     */
    async getBalance(): Promise<bigint> {
        const globalState = get(this.store);
        const selectedWallet = globalState.walletState.selectedWallet;

        return this.balanceOf(selectedWallet.address);
    }
}