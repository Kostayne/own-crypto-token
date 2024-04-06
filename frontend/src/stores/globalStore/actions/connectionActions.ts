import { get } from 'svelte/store';
import { Err, Ok, toResult, type Result, type AsyncResult } from 'base-ts-result';
import toast from 'svelte-french-toast';

import {
	JsonRpcProvider,
	InfuraProvider,
	CloudflareProvider,
	PocketProvider,
	AlchemyProvider,
	AnkrProvider,
	Contract,
} from 'ethers';

// types
import type { ConnectionData } from '@t/connectionData.type';
import type { EstablishConnectionErrT } from '@t/errors/establishConnectionError.type';
import type { AppContract } from '@t/appContract.type';

// actions
import { GlobalStoreActions } from '../globalStoreActions';

// utils
import { saveEncryptedData } from '@utils/encryptedDataStore';

// cfg
import { contractAbi, contractAddress } from '@src/cfg';

// custom types
type GetProviderErr = 'NO_DATA' | 'INVALID_TYPE' | 'INVALID_PLATFORM';

export class ConnectionActions extends GlobalStoreActions {
	public setConnectionData(data: ConnectionData) {
		const globalState = { ...get(this.store) };
		globalState.encrypted.connectionData = data;
		this.store.set(globalState);

		const saveRes = toResult(() => saveEncryptedData(globalState.encrypted, globalState.password));
		{
			if (saveRes.isError) {
				console.error(saveRes.unwrapErr());
				toast.error('Failed to save connection settings!');
			}
		}
	}

	private getProvider(data: ConnectionData): Result<JsonRpcProvider, GetProviderErr> {
		if (data.type === 'rpc') {
			if (!data.rpc) {
				return Err('NO_DATA');
			}

			return Ok(new JsonRpcProvider(data.rpc.url, data.rpc.network));
		}

		if (data.type === 'api') {
			if (!data.api) {
				return Err('NO_DATA');
			}

			const { apiKey, network, platform, infura, pocket } = data.api;

			switch (platform) {
				case 'alchemy':
					return Ok(new AlchemyProvider(network, apiKey));

				case 'ankr':
					return Ok(new AnkrProvider(network, apiKey));

				case 'cloudflare':
					return Ok(new CloudflareProvider(network));

				case 'infura':
					if (!infura) {
						return Err('NO_DATA');
					}

					return Ok(new InfuraProvider(network, infura.projectId, infura.projectSecret));

				case 'pocket':
					if (!pocket) {
						return Err('NO_DATA');
					}

					return Ok(new PocketProvider(network, pocket.appId, pocket.appSecret));

				default:
					return Err('INVALID_PLATFORM');
			}
		}

		return Err('INVALID_TYPE');
	}

	/**
	 * @description creates a connection from the selected wallet to a contract instance
	 */
	public async establishConnection(): AsyncResult<void, EstablishConnectionErrT> {
		const globalState = { ...get(this.store) };
		const connData = globalState.encrypted.connectionData;
		const selectedWallet = globalState.walletState.selectedWallet;

		// getting an ethereum blockchain provider
		const providerRes = this.getProvider(connData);
		{
			if (providerRes.isError) {
				console.error(providerRes.unwrapErr());
				return Err('PROVIDER_ERR');
			}
		}

		// connecting select wallet to a provider
		const connectWalletRes = toResult(() => selectedWallet.connect(providerRes.unwrap()));
		{
			if (connectWalletRes.isError) {
				console.error(connectWalletRes.unwrapErr());
				return Err('PROVIDER_ERR');
			}
		}

		// getting a contract instance
		const contractRes = toResult(
			() => new Contract(contractAddress, contractAbi, connectWalletRes.unwrap()),
		);
		{
			if (contractRes.isError) {
				console.error(contractRes.unwrapErr());
				return Err('CONTRACT_ERR');
			}
		}

		// successfully created a contract instance to interact with
		// blockchain from selected address
		globalState.walletState.contract = contractRes.unwrap() as unknown as AppContract;

		// update the store
		this.store.set(globalState);

		return Ok(undefined);
	}
}
