import { get } from "svelte/store";
import { Err, Ok, type Result } from "base-ts-result";

import { 
    JsonRpcProvider, 
    InfuraProvider, 
    CloudflareProvider, 
    PocketProvider, 
    AlchemyProvider, 
    AnkrProvider, 
    EtherscanProvider,
    type Provider, 
} from 'ethers';

// types
import type { ConnectionData } from "@t/connectionData.type";

// actions
import { GlobalStoreActions } from "../globalStoreActions"

// custom types
type GetProviderErr = 'NO_DATA' | 'INVALID_TYPE' | 'INVALID_PLATFORM';

export class ConnectionActions extends GlobalStoreActions {
    public setConnectionData(data: ConnectionData) {
        const globalState = { ...get(this.store) };
        globalState.encrypted.connectionData = data;
    }

    private getProvider(data: ConnectionData): Result<Provider, GetProviderErr> {
        if (data.type === 'RPC') {
            if (!data.rpc) {
                return Err('NO_DATA');
            }

            return Ok(new JsonRpcProvider(
                data.rpc.url,
                data.rpc.network,
            ));
        }

        if (data.type === 'API') {
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

                case 'etherscan':
                    return Ok(new EtherscanProvider(network, apiKey));

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

    public establishConnection() {
        
    }
}