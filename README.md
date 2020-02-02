# ConsenSys Academy October 2019 Final Project

This is a Proof of Existence dApp made for October 2019 ConsenSys Academy Developer Program. 

## Table of Contents

1. [Introduction](#introduction)
2. [Setup](#setup)
    * [Local](#local)
    * [Rinkeby](#rinkeby)
3. [UI](#ui)
4. [Design Pattern Decisions](/docs/design_pattern_decisions.md)
5. [Avoiding Common Attacks](/docs/avoiding_common_attacks.md)
6. [Integrations](#integrations)
    * [uPort](#uport)
    * [ENS](#ens)
    * [IPFS](#ipfs)
    * [Open Zeppelin](#open-zeppelin)
    * [Vyper](#vyper)
7. [Additional Resources](#additional-resources)
8. [Notes](#notes)

## Introduction

This dApp allow users to prove the existence of some data such as a picture, video, or document at some point in time with associated timestamps. The hash of the data along with its metadata is hosted and stored using IPFS which can be referenced later to verify the information's authenticity. This can be extremely useful for use cases such as verifying Copyright claims.

The two contracts are deployed and verified at

* `DocumentInfo.sol`: https://rinkeby.etherscan.io/address/0x3d77fc733d67D4CbB12657750c829c0ea747DBC4
* `ProofOfExistence.vy`: https://rinkeby.etherscan.io/address/0x902c83B540E648507FB865045a749A2a0917e8f1

Note that ProofOfExistence.vy could not be verified because the compiler version (0.1.0b14) was not available for verification.

* **Web App:** User interface made using React Native Web for cross-platform interoperability with iOS and Android and browser
* **Smart Contracts:**
    * [ProofOfExistence.vy](/contracts/ProofOfExistence.vy): Written in Vyper, records all IPFS Hashes uploaded with the web app, mapped to their uploader and a timestamp.
    * [DocumentInfo.sol](/contracts/DocumentInfo.sol): Main contract for users to retrieve metadata about their uploaded content, such as title and tags.
* **Testing:**
    The tests are written in javascript with one test file for each contract.

    * [proofOfExistence.test.js](/test/proofOfExistence.test.js) tests that the querying an IPFS hash that has been uploaded before will correctly return the block number, timestamp, and address of the uploader.

    * [documentInfo.test.js](/test/documentInfo.test.js) tests that the contract will retrieve data correctly and revert invalid inputs such as empty title, hashes, or tags. It also tests that the contract will only retrieve data uploaded by the address of the sender.
* **External Library:** [IterableMapping.sol](/contracts/lib/IterableMapping.sol) is a library based on the one described in the [solidity docs](https://solidity.readthedocs.io/en/develop/types.html#iterable-mappings) to implement a data structure to store the tags that the user adds to their content.
    * Mapping type so that duplicate tags can be easily checked
    * Iterable so all the tags associated with one particular content can be retrieved


## Setup

### Prerequisites
- [Metamask](https://metamask.io/) or [Uport](https://www.uport.me/)
- [Node.js](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/) (recommended) or [npm](https://www.npmjs.com/)
- [Python 3.6](https://www.python.org/downloads/) or above
- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache](https://www.trufflesuite.com/ganache) (optional)

### Local

Install Truffle if haven't already:

```
npm install -g truffle
```

In order to compile `.vy` contracts, you will need to install `Vyper`. There are a number of ways to do that, see in [additional resources](#additional-resources). It is recommended that a virtual Python environment to be created first:

```
python3.6 -m venv ~/vyper-env
source ~/vyper-env/bin/activate
```

And then to install through `pip`:

```
pip install vyper
```

To run the web or mobile app connected to contracts deployed on your local truffle or ganache blockchain: 

1. Clone the repository:

```
```

2. Install dependencies:

```
yarn
```

or

```
npm install
```

3. Run a local blockchain

Using `truffle`:

```
truffle develop
```

Using `ganache`:

```
ganache-cli
```

**Note**: These two blockchain run on different ports. By default the app connects to the truffle blockchain at port _`:9545`_, but if you want to connect to ganache, edit the `web3` fallback url in [`config.js`](./packages/common/src/config.js) accordingly:

```javascript
const drizzleOptions = {
    ...
    web3: {
        fallback: {
            type: "ws",
            // Uncomment this line
            // url: "ws://127.0.0.1:8545", // ganache-cli

            // Comment out the truffle websocket url
            url: "ws://127.0.0.1:9545", // truffle develop
        }
    },
    ...
};
```

4. Deploy the contracts

```
truffle migrate
```
Note that some features such as ENS can only be used if deployed on Rinkeby

5. Set `localDeployment` in [`config.js`](./packages/common/src/config.js) to true:
```javascript
const deployConfig = {
    localDeployment: true,
    ...
}
```

6. Run the server:

_**Web App**_

Using `npm`:

```
cd packages/web
npm start
```

Using `yarn`:

```
yarn workspace web start
```

**Note**: You do not need the Metamask extension in the browser if you deploy a local blockchain. The web app will connect to the local blockchain automatically.

_**Mobile App**_

Xcode for iOS or Android Studio is required to run a React Native app on emulators or an actual device. Then you will need to connect the device to your local blockchain instance. See the links listed [here](#additional-resources) for more details and troubleshooting.

To start the React Native Metro Bundler:

```
yarn workpace mobile start
```

or

```
npx react-native start
```

in the `packages/mobile` directory

_iOS_

Install `CocoaPods`

```
sudo gem install cocoapods
```

Install dependencies with `CocoaPods`

```
cd packages/mobile/ios
pod install
```

To run on the simulator

```
yarn workspace mobile ios
```

or

```
npx react-native run-ios
```

if in the `packages/mobile` directory.

To run on a physical device, connect the device via a USB cable and add the `--device` flag
```
yarn ios --device
```

If you want to run on device, you will have to manually look up the local IP address of the machine you are running the blockchain on. Go to the network settings of your machine to find your local IP, and change the websocket url accordingly.

For example, if your local IP address is `10.0.0.1` then change the `web3` fallback url to:

```javascript
const drizzleOptions = {
    ...
    web3: {
        fallback: {
            type: "ws",            
            // change 10.0.0.1 to your local machine IP address
            url: "ws://10.0.0.1:9545", // truffle develop
        }
    },
    ...
};
```

_Android_

Make sure to install the [Android Debug Bridge (adb)](https://developer.android.com/studio/command-line/adb) to connect to truffle.

After installing the Android SDK, and `ANDROID_HOME` environment variables are set up (see links in [additional resources](#additional-resources)), create a new Android Virtual Device in Android Studio.

To run the app

```
yarn workspace mobile android
```

or

```
npx react-native run-android
```

if in the `packages/mobile` directory.

To run on a physical device, connect the device via a USB cable and reverse the ports so the android device can connect to the development server.

```
adb reverse tcp:8081 tcp:8081
```

Then to connect to your to local blockchain for the emulator/device,

```
# Change the port number to the one the local blockchain is running on
adb reverse tcp:9545 tcp:9545
```

**Notes**:
* If the Metro bundler has issues finding some node modules, you might need to restart it with a `--reset-cache` flag
* You will need to run an a physical device to use the camera feature


### Rinkeby

To deploy on Rinkeby, make sure that `localDeployment` in [`config.js`](./packages/common/src/config.js) is set to false (this is the default):

```javascript
const deployConfig = {
    localDeployment: false,
    ...
}
```

If you want to deploy your own instances of the contracts onto Rinkeby, you will need:

* The mnemonic of the account used to deploy the contract to Rinkeby (Metamask: Settings -> Security & Privacy -> Reveal Seed Words). Make sure to get some ether from the [Rinkeby faucet](https://faucet.rinkeby.io/) to that account
* Infura project id - register for an account in [Infura](https://infura.io/), create a new project, and copy the project id provided

Provide [`testnetConfig.js`](/textnetConfig.js) with the mnemonic and Infura project id then use the command

```
truffle migrate --network rinkeby
```

then set `useDeployedAddresses` to false so the web app won't try to use the already deployed contract addresses on Rinkeby.

```javascript
const deployConfig = {
    localDeployment: true,
    // this is true by default
    useDeployedAdresses: false,
    ...
}
```

If you want to use the contracts already deployed on Rinkeby at
* 
*
you don't need to do any changes in the `config.js` file.

Run the development server inside the `packages/web` directory for the web app through

```
yarn start
```

or

```
yarn ios
yarn android
```

inside `packages/mobile` directory for mobile.

## UI

## Integrations

### uPort

If `localDeployment` is set as false, then there will be a login screen where the user can choose to use uPort as their web3 provider and sign transactions using the address from their uPort mobile application. The key pair with the private key of the entity they are logging in with is located in a [public file in the repository](/packages/common/src/utils/UportConnect/config.js) in order to build trust with users as they are consistently interacting with the same entity. Thus this feature is not yet suitable for production environments.

Users can still connect to uPort without the DID and private key pair, but might interact with the web app with a different address, and thus users will not see consistent account information across sessions.

On the web application, by clicking on the uPort button, users will be shown an option to scan a QR code to login. Scanning using the uPort app on [iOS](https://apps.apple.com/us/app/uport-id/id1123434510) or [Android](https://play.google.com/store/apps/details?id=com.uportMobile&hl=en) will prompt the app to ask the user to login. 

On the mobile app, the user will be redirected to the uPort app if it is installed on their phone, or else they will be notified that uPort is not installed. On successful login, the user will be redirected back to the mobile app they will be redirected to the home page.

### ENS

The two contracts are registered on ENS on the .test domain, which expires after 28 days. It was registered through [Ethereum Name Serivce](https://app.ens.domains/), at the domain names [documentinfo.test](https://app.ens.domains/name/documentinfo.test) and [proofofexistence.test](https://app.ens.domains/name/proofofexistence.test).

### IPFS

All the media content in the app are uploaded to IPFS with the [Javascript IPFS client](https://github.com/ipfs/js-ipfs-http-client) through an Infura node. The content is retrived through an IPFS gateway, in the format `https://gateway.ipfs.io/ipfs/<ipfshash>`. 
This ensures that the content is stored in a distributed manner, instead of from a centralised database.

However, the content uploaded with IPFS are not guaranteed to be continually stored, and must be pinned. See [this article](https://docs.ipfs.io/guides/concepts/pinning/) for more details.

### Open Zeppelin

The [Pausable.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/lifecycle/Pausable.sol) contract from the Open Zeppelin library was used to manage circuit breaking in the [DocumentInfo.sol](/contracts/DocumentInfo.sol) contract.

The [Open Zeppelin SDK](https://github.com/OpenZeppelin/openzeppelin-sdk) was used to initialize the project so that the contracts could be upgradable via a proxy, where the address and state of the contract would not be changed. This is done by installing the `@openzeppelin/cli` package, integrated with the truffle project.

### Vyper

The contract storing the IPFS hash of documents is written in a new experimental language, Vyper, which is a pythonic smart contract language. It is designed to be more readable and secure, an alternative to Solidity.

To compile the `.vy` contract, please install Vyper in a virtual environment described in the [set up](#setup) in order for truffle to be able to compile the contract. 

## Additional Resources
* [How to install Vyper](https://vyper.readthedocs.io/en/v0.1.0-beta.10/installing-vyper.html)
* [React Native set up](https://facebook.github.io/react-native/docs/getting-started)
* [Connect mobile device to local blockchain](https://www.trufflesuite.com/tutorials/drizzle-and-react-native)

# Notes

* The UI components and design based on [this React Native app](https://github.com/react-ui-kit/dribbble2react/tree/master/plant-app)
* The Open Zeppelin SDK does not support Vyper yet, so no features such as upgradability can be used for that contract