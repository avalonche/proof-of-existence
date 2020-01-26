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
    useDeployedAdresses: false,
    contracts: [
        {
            name: "ProofOfExistence",
            address: "0x4Bae726c6BED908AFBdD854106BA5350217184f8",
        },
        {
            name: "DocumentInfo",
            address: "0x4Bae726c6BED908AFBdD854106BA5350217184f8"
        },
    ]
}
