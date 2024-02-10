import { entropyToMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';


export function generateMnemonicWords(): string[] {
    const arr = new Uint8Array(16);
    const newArr = crypto.getRandomValues(arr);
    const mnemonic = entropyToMnemonic(newArr, wordlist);

    return mnemonic.split(' ');
}