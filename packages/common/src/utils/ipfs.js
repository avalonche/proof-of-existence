// using the ipfs api
import IPFS from 'ipfs-http-client';

// If running a local ipfs daemon
// const ipfs = new IPFS({host: 'localhost', port: 5001, protocol: 'https' });

// using infura as the provider
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default ipfs;