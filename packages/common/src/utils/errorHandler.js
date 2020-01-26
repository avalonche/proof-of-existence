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

function handleErrorMessage(message) {
    const reason = message.split(errorString)[1];

    console.log(message);
    switch(reason) {
        case 'revert':
            break;
    }
}

export function txHandler(key, TXObject, index = 0) {
    const txInfo = {};
    const errors = {};
    if (TXObject) {
        const tx = TXObject[index];
        const txStatus = tx && tx.status;
        console.log(tx)
        console.log(txStatus)

        switch(txStatus) {
            case 'success':
                txInfo[key] = { txHash: tx.receipt.transactionHash };
                break;
            case 'error':
                errors[key] = tx.error;
                console.log(tx.error);
                break;
        }
    }
    return {txInfo, errors};
}