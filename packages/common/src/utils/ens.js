import ENS from 'ethereum-ens';
import { hasWSProvider, getWeb3 } from './connector';

let ens;

export async function resolveAddress(address) {
    if (!address || address.startsWith('0x')) {
        return address;
    }

    if (!hasWSProvider) {
        ens = ens || new ENS(getWeb3());
        return ens.resolver(address).addr();
    }
}