// Drizzle contracts
import DocumentInfo from "./contracts/DocumentInfo.json";
import ProofOfExistence from "./contracts/ProofOfExistence.json";

const drizzleOptions = {
    contracts: [DocumentInfo, ProofOfExistence],
    web3: {
        fallback: {
            type: "ws",
            // url: "ws://127.0.0.1:8545", // ganache-cli
            url: "ws://127.0.0.1:9545", // truffle develop
        }
    },
    networkWhitelist: [
        4
    ]
};

export default drizzleOptions;


export const deployConfig = {
    localDeployment: false,
    useDeployedAdresses: true,
    contracts: [
        {
            name: "ProofOfExistence",
            address: "0x902c83B540E648507FB865045a749A2a0917e8f1",
        },
        {
            name: "DocumentInfo",
            address: "0x3d77fc733d67D4CbB12657750c829c0ea747DBC4"
        },
    ]
}
