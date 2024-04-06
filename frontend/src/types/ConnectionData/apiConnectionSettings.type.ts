import type { InfuraConnectionData } from './api/infuraConnectionData.type';
import type { PocketConnectionData } from './api/pocketConnectionData.type';

export interface ApiConnectionSettings {
	apiKey: string;
	network: 'goerli' | 'sepolia';
	platform: 'infura' | 'alchemy' | 'cloudflare' | 'pocket' | 'ankr';

	// platform specific data
	infura?: InfuraConnectionData;
	pocket?: PocketConnectionData;
}
