const errorString = 'VM Exception while processing transaction: revert';
const tagErrors = [
    'Tag index out of bounds',
    'Uploaded content have a limit of 10 tags each',
    'Tag must not be empty or exceed 25 bytes',
]
const contentErrors = [
    'This content has previously been uploaded',
    'The content requested does not exist',
]

const titleErrors = [
    'Title must not be empty or exceed 32 bytes'
]

const ipfsHashErrors = [
    'The length of your IPFS hash is invalid'
]
// revert, out of gas, block gas limit reached
// need to retrive error message
// Error: Returned error: VM Exception while processing transaction: revert This content has previously been uploaded
function handleErrorMessage(message) {
    if (message.indexOf(errorString) >= 0) {
        const reason = message.split(errorString)[1].trim();

        if (tagErrors.includes(reason)) {
            return { tags: reason }
        } else if (contentErrors.includes(reason)) {
            return { content: reason }
        } else if (titleErrors.includes(reason)) {
            return { title: reason }
        } else if (ipfsHashErrors.includes(reason)) {
            return { ipfsHash: reason }
        } else if (message.indexOf('Pausable: paused') >=0) {
            return { paused: 'The contract is currently paused. Please contact the contract owner to unpause it'}
        } else {
            return { hash: 'Your content transaction could not be recorded in the contract' }
        }
    } else {
        return { error: message }
    }
}

export function txHandler(key, TXObject, index = 0) {
    const txInfo = {};
    let errors = {};
    if (TXObject) {
        const tx = TXObject[index];
        const txStatus = tx && tx.status;

        switch(txStatus) {
            case 'success':
                txInfo[key] = tx.receipt.transactionHash;
                break;
            case 'error':
                errors = handleErrorMessage(tx.error.message);
                break;
        }
    }
    return {txInfo, errors};
}