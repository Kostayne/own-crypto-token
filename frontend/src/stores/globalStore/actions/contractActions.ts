import { get } from "svelte/store";
import { toResultAsync, type AsyncResult, Ok } from "base-ts-result";
import type { AddressLike, EthersError } from "ethers";

// actions
import { GlobalStoreActions } from "../globalStoreActions";

// types
import type { AppContract } from "@t/appContract.type";

export class ContractActions extends GlobalStoreActions {
    private getContract(): AppContract {
        const globalState = get(this.store);
        return globalState?.walletState?.contract as AppContract;
    }

    private getSelectedWallet() {
        const globalState = get(this.store);
        return globalState.walletState.selectedWallet;
    }

    /**
     * @description Get balance of the provided address
     * @param address Address string
     * @returns Bigint balance
     */
    async balanceOf(address: AddressLike): AsyncResult<bigint, EthersError> {
        const contract = this.getContract();

        if (!contract) {
            console.error('Tried to get balance without a contract instance');
            return Ok(BigInt(0));
        }

        return toResultAsync(() => 
            contract.balanceOf(address)
        );
    }

    /**
     * @description Get balance of the current wallet
     * @returns Balance BigInt
     */
    async getBalance(): AsyncResult<bigint, EthersError> {
        const selectedWallet = this.getSelectedWallet();
        return this.balanceOf(selectedWallet.address);
    }

    /**
     * @param addr 
     * @param val tokens count to transfer
     */
    async transferTo(addr: AddressLike, val: number): AsyncResult<unknown, EthersError> {
        const contract = this.getContract();
        return toResultAsync(contract.transfer(addr, val));
    }

    /**
     * @param fromAddr 
     * @param toAddr 
     * @param val tokens count to transfer
     */
    async transferFrom(fromAddr: AddressLike, toAddr: AddressLike, val: number): AsyncResult<unknown, EthersError> {
        const contract = this.getContract();
        return toResultAsync(contract.transferFrom(fromAddr, toAddr, val));
    }

    /**
     * @param ownerAddr 
     * @description how much tokens you can spend from someone else's wallet
     */
    async allowance(ownerAddr: AddressLike): AsyncResult<bigint, EthersError> {
        const contract = this.getContract();
        const currAddress = this.getSelectedWallet().address;

        return toResultAsync(contract.allowance(ownerAddr, currAddress));
    }

    /**
     * @param addr 
     * @param value 
     * @description allows to spend your money to the other man
     */
    async allowTo(addr: AddressLike, value: number): AsyncResult<unknown, EthersError> {
        const globalState = get(this.store);
        const contract = globalState.walletState.contract as AppContract;

        return toResultAsync(contract.approve(addr, value));
    }

    // admin actions
    async isAdmin(): AsyncResult<boolean, EthersError> {
        const contract = this.getContract();
        const addr = this.getSelectedWallet().address;

        return toResultAsync(contract.isAdmin(addr));
    }

    /**
     * @param addr 
     * @param val 
     * @description mints (adds) more tokens to the addr
     */
    async mint(addr: AddressLike, val: number): AsyncResult<unknown, EthersError> {
        const contract = this.getContract();
        return toResultAsync(contract.mint(addr, val));
    }

    /**
     * @param val 
     * @description removes tokens from the owner addr
     */
    async burn(val: number): AsyncResult<unknown, EthersError> {
        const contract = this.getContract();
        return toResultAsync(contract.burn(val));
    }

    async addAdmin(addr: AddressLike): AsyncResult<unknown, EthersError> {
        const contract = this.getContract();
        return toResultAsync(contract.addAdmin(addr));
    }

    async rmAdmin(addr: AddressLike): AsyncResult<unknown, EthersError> {
        const contract = this.getContract();
        return toResultAsync(contract.removeAdmin(addr));
    }

    /**
     * @param addr 
     * @description makes address able to receive / send tokens
     */
    async addToWhiteList(addr: AddressLike): AsyncResult<unknown, EthersError> {
        const contract = this.getContract();
        return toResultAsync(contract.addToWhiteList(addr));
    }

    /**
     * @param addr 
     * @description makes address not able to receive / send tokens
     */
    async rmFromWhiteList(addr: AddressLike): AsyncResult<unknown, EthersError> {
        const contract = this.getContract();
        return toResultAsync(contract.removeFromWhiteList(addr));
    }

    /**
     * @param addr 
     * @description transfers contract ownership
     */
    async changeOwner(addr: AddressLike): AsyncResult<unknown, EthersError> {
        const contract = this.getContract();
        return toResultAsync(contract.transferOwnership(addr));
    }
}