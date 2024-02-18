export interface ApiConnectionSettings {
    apiKey: string;
    network: string;
    platform: 'etherscan' | 'infura' | 'alchemy' | 'cloudflare' | 'pocket' | 'ankr';
}