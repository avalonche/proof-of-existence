# ConsenSys Academy October 2019 Final Project

This is a Proof of Existence dApp made for October 2019 ConsenSys Academy Developer Program. 

## Table of Contents

1. [Introduction](#introduction)
2. [Setup](#setup)
    * [Local](#local)
    * [Rinkeby](#rinkeby)
3. [UI](#ui)
4. [Testing](#testing)
5. [Design Pattern Decisions](#/docs/design_pattern_decisions.md)
6. [Avoiding Common Attacks](#/docs/avoiding_common_attacks.md)
7. [Additional Integrations](#additional-integrations)
    * [uPort](#uport)
    * [ENS](#ens)
    * [Arweave + IPFS](#arweaveipfs)
    * [Open Zeppelin](#open-zeppelin)
    * [Vyper](#vyper)
    * [graphql](#to-be-decided)

## Introduction

This dApp allow users to prove the existence of some data such as a picture, video, or document at some point in time with associated timestamps. The hash of the data along with its metadata is hosted and stored using IPFS which can be referenced later to verify the information's authenticity. This can be extremely useful for use cases such as verifying Copyright claims.

* **Web App:** User interface made using React Native for cross-platform interoperability with iOS and Android
* **Smart Contracts:**
    * [_proof_of_existence.sol_]()
    * 

## Setup

### Prerequisites
- [Metamask](https://metamask.io/) plugin in Chrome 
- [Node.js](https://nodejs.org/en/) and npm(?) or yarn
- Truffle
- Ganache

### Local

Some features such as ENS can only be used if deployed on Rinkeby

### Rinkeby

## UI

## Testing

## Additional Integrations

# Notes

* Websocket connections to truffle not supported on localhost
* Homepage image sourced from [here](https://unsplash.com/photos/xTKSR0omGS4)
