# Design Pattern Decisions

## Circuit breaker

Circuit breaker patterns are implemented in both contracts.
In `DocumentInfo.sol` this is implemented through Open Zeppelin's [Pausable.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/lifecycle/Pausable.sol).
In `ProofOfExistence.vy` is this implemented manually by assigning the owner of the contract as the only one who can set the emergency stop to the contract.

A pauser can pause the contract which will stop all uploads and edits to content. However, users will still be able to view and verify the IPFS hashes uploaded by others. This is enforced by modifiers. Essentially, all non view functions are disabled when the contract is paused.

The paused variable is public so that the status is reflected correctly to the owner, who will be able to toggle the emergency on or off.

## Restricting access with roles

As mentioned above, only users with the priviledged access can set the emergency status of the contract. The role control provided by `Pausable.sol` allows the owner to assumer a pauser role, and the priviledge to grant other addresses the pauser role as well.


## Proxy Upgrade Pattern

The [Open Zeppelin SDK](https://docs.openzeppelin.com/cli/2.6/) provides a upgradable pattern that can be easily integrated with truffle. It implements a proxy pattern that forwards data and calls so that the contract will still have the same address. It can be upgraded using the command.

```
npx oz upgrade
```

Unlike using the registry contract upgrade design where data from the old contract to the new one needs to be ported manually, using a `DELEGATECALL` in this particular design directly forwards the calls and data from the old version to the new one. In order to avoid issues with losing data of the user's past uploads, this proxy design is used.
The caveat of this design is that the contract will need to have the same storage layout. State variables can not be removed nor its type changed. However, all the functions of a smart contract can be modified or removed.

