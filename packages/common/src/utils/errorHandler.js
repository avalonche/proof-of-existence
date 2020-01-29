const errorString = 'VM Exception while processing transaction: ';
const tagErrors = [
    'Tag index out of bounds',
    'This tag does not exist for this content', // removing tag
    'This tag already exists for this content', // adding tag
    'Uploaded content have a limit of 10 tags each',
    'Tag must not be empty or exceed 25 bytes',
]
const contentErrors = [
    'This content has previously been uploaded',
    'The content requests does not exist',
]

const descriptionErrors = [
    'Description must not exceed 255 bytes'
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
    if (indexOf(errorString) >= 0) {

    }
}

export function txHandler(key, TXObject, index = 0) {
    const txInfo = {};
    const errors = {};
    if (TXObject) {
        const tx = TXObject[index];
        const txStatus = tx && tx.status;

        switch(txStatus) {
            case 'success':
                txInfo[key] = tx.receipt.transactionHash;
                break;
            case 'error':
                errors[key] = tx.error.message;
                break;
        }
    }
    return {txInfo, errors};
}