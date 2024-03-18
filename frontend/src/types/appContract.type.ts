import type { AddressLike } from "ethers";
import type { BaseContract } from "ethers";
import type { BaseContractMethod } from "ethers";
import type { ContractTransactionResponse } from "ethers";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description Contract with described methods
 */
export type AppContract = BaseContract & {
    balanceOf: BaseContractMethod<[AddressLike], bigint, bigint>;

    addAdmin: BaseContractMethod<[AddressLike], any, ContractTransactionResponse>;
    removeAdmin: BaseContractMethod<[AddressLike]>;
    
    addToWhiteList: BaseContractMethod<[AddressLike]>;
    removeFromWhiteList: BaseContractMethod<[AddressLike]>;

    mint: BaseContractMethod<[AddressLike, number]>;
    burn: BaseContractMethod<[number]>;

    pause: BaseContractMethod;
    unpause: BaseContractMethod;

    transfer: BaseContractMethod<[AddressLike, number]>;
    transferFrom: BaseContractMethod<[AddressLike, AddressLike, number]>;

    transferOwnership: BaseContractMethod<[AddressLike]>;

    allowance: BaseContractMethod<[AddressLike, AddressLike]>;
};