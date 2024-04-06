import type { ConnectionData } from './connectionData.type';
import type { HDAccountGenerationData } from './hdAccountGenerationData.type';

export interface EncryptedData {
	seedPhrase: string;
	accounts: HDAccountGenerationData[];
	connectionData: ConnectionData;
}
