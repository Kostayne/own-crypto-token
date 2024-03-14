import type { ApiConnectionSettings } from "./ConnectionData/apiConnectionSettings.type";
import type { RpcConnectionSettings } from "./ConnectionData/rpcConnectionSettings.type";

export interface ConnectionData {
    type: 'RPC' | 'API';
    rpc?: RpcConnectionSettings;
    api?: ApiConnectionSettings;
}