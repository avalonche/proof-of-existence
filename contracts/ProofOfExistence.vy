# @version 0.1.0b13

# Proof of Existence

# This smart contract indexes the hash of all documents uploaded 
# through this contract which any user can verify its existence 
# and authenticity by looking up the ipfs hash

# Document information
# Note: Struct and external contract declaractions must come
# before event, global and function declarations
struct Document:
    blockNumber: uint256
    uploadTime: timestamp
    uploader: address

# Events
# Note: Events must come before global and function definitions
# Note: Vyper does not allow dynamic arrays, so limit the 
# ipfs hash string to be 128 characters
DocumentUploaded: event({
    ipfsHash: string[128],
    blockNumber: uint256,
    uploadTime: timestamp,
    uploader: address
})

# Keep track of the documents in the contract
documentCount: uint256

# Documents indexed by the ipfs hash (which is longer than 32 bytes)
documents: public(map(string[128], Document))

owner: address

# Circuit breaker
stopped: bool

@public
def __init__():
    self.owner = msg.sender
    self.documentCount = 0
    self.stopped = False

@public
def uploadDocument(_ipfsHash: string[128]):
    """
    @notice Records the timestamp and uploader by the ipfs hash
    @dev Emits DocumentUploaded event
    @param The ipfs hash of the document
    """
    # basic validation for the ipfs hash
    assert len(_ipfsHash) >= 32
    # check if the document already exists
    assert self.documents[_ipfsHash].uploader == ZERO_ADDRESS
    # check for integer overflow
    assert self.documentCount < MAX_UINT256

    assert self.stopped == False

    _blockNumber: uint256 = block.number
    _uploadTime: timestamp = block.timestamp
    _uploader: address = msg.sender
    # add document to mapping
    self.documents[_ipfsHash] = Document({
        blockNumber: _blockNumber,
        uploadTime: _uploadTime,
        uploader: _uploader
    })
    self.documentCount += 1
    log.DocumentUploaded(_ipfsHash, _blockNumber, _uploadTime, _uploader)

@public
@constant
def numDocuments() -> uint256:
    """
    @notice Returns the number of documents uploaded so far
    @return The document count
    """
    return self.documentCount

@public
@constant
def verifyDocument(ipfsHashToVerify: string[128]) -> (uint256, timestamp, address):
    """
    @notice Anyone with the document can generate the ipfs hash and verify its exsistence by checking if the generated hash matches the uploaded hash
    @param ipfsHashToVerify The ipfs hash we want to check matches the uploaded document
    @return Returns the block number, time uploaded and uploader
    """
    document: Document = self.documents[ipfsHashToVerify]
    # check document exists
    assert document.uploader != ZERO_ADDRESS

    return (document.blockNumber, document.uploadTime, document.uploader)

@public
@constant
def isOwner() -> bool:
    """
    @notice Returns whether the current sender is the owner of this contract
    @return true if sender is contract owner
    """
    return self.owner == msg.sender

@public
@constant
def isActive() -> bool:
    """
    @notice Returns whether the contract is paused by the owner
    @return true if contract is not paused
    """
    return self.stopped


@public
def toggleContractActive():
    """
    @notice A circuit breaker to pause the contract if necessary
    @dev Only the contract owner can call this function
    """
    assert self.owner == msg.sender

    self.stopped = not self.stopped