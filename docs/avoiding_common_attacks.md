# Avoiding Common Attacks

## Integer Overflow and Underflow

Integer overflow is possible when trying to get the number of documents when there are over 2<sup>256</sup> documents in the contract. The contract will check that the number of documents will not exceed 2<sup>256</sup> and revert all documents added to the contract afterwards.

Other cases include integer overflow for tags. This is again another impractical scenario as the contract itself does not store ether so the gas cost to an attacker will likely exceed any potential benefits.

## DoS with Block Gas Limit

Removal of `while` loops is used to prevent DoS attacks. This is done by breaking up looping operations into separate contract calls, so that if one call fails, the whole operation is not blocked. For example, to get all content a user has uploaded, a contract call is made to get the number of documents. Then each document is retrieved through a separate call by iterating through the index once the number of documents is known. This is also done when iterating through tags.

Another potential issue is when the user inputs strings of arbitrary length, such as for the title. As data storage on chain increases disproportionally with the size of the data, this can easily result in an `out of gas` error. Thus the size of these strings are limited to a set number of bytes using constants such as `MAX_TAG_LENGTH` which are then enfored by modifiers in the contract.

Similarly, the number of the tags is limited to 10 per document to prevent unecessarily large amounts of data stored on chain.

If the user wishes to store larger amounts of text data with their content, such as descriptions, it is advised that it be stored together with the video or image data on IPFS.