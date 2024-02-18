import type { ApiConnectionSettings } from "./ConnectionSettings/apiConnectionSettings.type";
import type { RpcConnectionSettings } from "./ConnectionSettings/rpcConnectionSettings.type";

export interface ConnectionData {
    type: 'RPC' | 'API';
    rpc?: RpcConnectionSettings;
    api?: ApiConnectionSettings;
}