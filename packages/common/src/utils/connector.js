import Web3 from 'web3';
import UportConnect from './UportConnect';
import drizzleOptions, { deployConfig } from '../config';
import { checkInstalled } from './UportConnect/index.native';

let web3;

function browserLogin() {
    // Modern dapp browsers
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    }

    if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    }

    if (window.ethereum || window.web3) {
        // drizzle will configure the rest
        return true;
    }
    // // Non-dapp browser
    // Alert.alert(
    //     'No Web3 browser provider detected. Please try another login method');        
}

function uportLogin() {
    const provider = UportConnect.getProvider();
    checkInstalled();
    web3 = new Web3(provider);
    return web3;
}

function localLogin() {
    web3 = new Web3(drizzleOptions.web3.fallback.url);
    return web3
}

const logins = { browserLogin, uportLogin, localLogin }

export function getWeb3(provider) {
    return logins[`${provider}Login`]();
}

export function getCurrentProvider() {
    return web3;
}

export function hasWSProvider() {
    return deployConfig.localDeployment;
}

export function configureOptions(web3) {
    if (deployConfig.useDeployedAdresses && !deployConfig.localDeployment) {
        drizzleOptions.contracts = deployConfig.contracts.map((contractInfo, index) => {
            const options = {
                // data: '',
            }
            const contract = new web3.eth.Contract(drizzleOptions.contracts[index], contractInfo.address, options);
            return {
                contractName: contractInfo.name,
                web3Contract: contract,
            }
        })
    }
    if (typeof web3 === 'object') {
        drizzleOptions.web3.customProvider = web3;
    }

    return drizzleOptions;
}

export const DEFAULT_GAS = 400000;
