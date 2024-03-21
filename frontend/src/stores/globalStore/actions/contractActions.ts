import { get } from "svelte/store";
import { toResultAsync, type AsyncResult } from "base-ts-result";
import type { AddressLike } from "ethers";
import toast from "svelte-french-toast";

// actions
import { GlobalStoreActions } from "../globalStoreActions";

// types
import type { AppContract } from "@t/appContract.type";
import type { EthersError } from "ethers";

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

    /**
     * @param addr 
     * @param val tokens count to transfer
     */
    async transferTo(addr: AddressLike, val: number): AsyncResult<unknown, EthersError> {
        const globalState = get(this.store);
        const contract = globalState.walletState.contract as AppContract;

        return toResultAsync(contract.transfer(addr, val));
    }

    /**
     * @param fromAddr 
     * @param toAddr 
     * @param val tokens count to transfer
     */
    async transferFrom(fromAddr: AddressLike, toAddr: AddressLike, val: number): AsyncResult<unknown, EthersError> {
        const globalState = get(this.store);
        const contract = globalState.walletState.contract as AppContract;

        return toResultAsync(contract.transferFrom(fromAddr, toAddr, val));
    }

    async allowance(ownerAddr: AddressLike): AsyncResult<bigint, EthersError> {
        const globalState = get(this.store);
        const contract = globalState.walletState.contract as AppContract;
        const currAddress = globalState.walletState.selectedWallet.address;

        return toResultAsync(contract.allowance(ownerAddr, currAddress));
    }
}