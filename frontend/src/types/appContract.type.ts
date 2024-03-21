import type { AddressLike } from "ethers";
import type { TransactionResponse } from "ethers";
import type { BaseContract } from "ethers";
import type { BaseContractMethod } from "ethers";
import type { ContractTransactionResponse } from "ethers";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description Contract with described methods
 */
export type AppContract = BaseContract & {
    balanceOf: BaseContractMethod<[AddressLike], bigint, bigint>;

    isAdmin: BaseContractMethod<[AddressLike], boolean, boolean>
    addAdmin: BaseContractMethod<[AddressLike], any, ContractTransactionResponse>;
    removeAdmin: BaseContractMethod<[AddressLike], ContractTransactionResponse>;
    
    addToWhiteList: BaseContractMethod<[AddressLike], ContractTransactionResponse>;
    removeFromWhiteList: BaseContractMethod<[AddressLike], ContractTransactionResponse>;

    mint: BaseContractMethod<[AddressLike, number], ContractTransactionResponse>;
    burn: BaseContractMethod<[number], ContractTransactionResponse>;

    pause: BaseContractMethod<[], ContractTransactionResponse>;
    unpause: BaseContractMethod<[], ContractTransactionResponse>;

    transfer: BaseContractMethod<[AddressLike, number], TransactionResponse>;
    transferFrom: BaseContractMethod<[AddressLike, AddressLike, number], TransactionResponse>;

    transferOwnership: BaseContractMethod<[AddressLike], TransactionResponse>;

    allowance: BaseContractMethod<[AddressLike, AddressLike], bigint, bigint>;
    approve: BaseContractMethod<[AddressLike, number], TransactionResponse>;
};