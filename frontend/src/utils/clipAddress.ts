/**
 * @param address account address (0xa44...)
 * @returns clips address in the middle like so 0XA44...785BD
 */
export function clipAddress(address: string, halfLength = 7) {
    return `${address.slice(0, halfLength)}..${address.slice(-halfLength)}`;
}