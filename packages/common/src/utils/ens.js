import ENS from 'ethereum-ens';

let ens;

export function resolveAddress(address, ensEnabled) {
    if (!address || address.startsWith('0x')) {
        return Promise.resolve(address);
    }

    if (!ensEnabled) {
        throw new Error('ENS is not enabled in this network');
    }

    // ens = ens || new ENS(getWeb3())
    // return ens.resolver(address).addr();
}