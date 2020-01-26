pragma solidity ^0.5.0;

import "@openzeppelin/contracts/lifecycle/Pausable.sol";
import "./lib/IterableMapping.sol";

contract DocumentInfo is Pausable {
    using IterableMapping for IterableMapping.itmap;
    /* Constants */
    // limit length of tag and title to control gas price of storing metadata
    uint8 public constant MAX_TITLE_LENGTH = 32;
    uint8 public constant MAX_TAG_LENGTH = 32;
    uint8 public constant MAX_DESCRIPTION_LENGTH = 255;
    // Limit to 10 tags per document to conserve gas
    uint8 public constant MAX_NUM_TAG = 10;

    /* Mappings */
    // map documents to the owner that uploaded them
    mapping(address => DocumentMetadata[]) documentsByUploader;
    // map all documents by id to prevent same content uploaded again
    mapping(bytes32 => string) documentHashById;

    /* Document Struct */
    struct DocumentMetadata {
        bytes32 documentId;
        string title;
        string description;
        IterableMapping.itmap tags; // can't check for unique tag in array, use mapping
    }

    /* Document Events */
    event DocumentCreated(bytes32 indexed documentId, string ipfsHash, string title, string description, uint documentIndex);
    event TitleEdited(string oldTitle, string newTitle, uint timeEdited);
    event DescriptionEdited(string oldDescription, string newDescription, uint timeEdited);
    event TagAdded(string tag, uint8 tagCount, uint timeAdded);
    event TagRemoved(string tag, uint8 tagCount, uint timeRemoved);

    /* Length Constraint Modifiers */
    /**
     * @notice Require a ipfs hash length between 32 and 64
     * @dev Ipfs Hash have different lengths from different hashing algorithms, but cryptographic hashes generally have length limit of 64 bytes
     */
    modifier verifyIPFSHash (string memory _ipfsHash) {
        require(
            32 <= bytes(_ipfsHash).length && bytes(_ipfsHash).length <= 64,
            'The length of your IPFS hash is invalid'
        );
        _;
    }

    /**
     * @notice Check title length constraints
     * @dev Recommended to store on ipfs if metadata is too large
     */
    modifier verifyTitleLength (string memory _title) {
        require(
            0 < bytes(_title).length && bytes(_title).length <= MAX_TITLE_LENGTH,
            'Title must not be empty or exceed 32 bytes'
        );
        _;
    }
        /**
     * @notice Check description length constraints
     */
    modifier verifyDescriptionLength (string memory _description) {
        require(
            0 <= bytes(_description).length && bytes(_description).length <= MAX_DESCRIPTION_LENGTH,
            'Description must not exceed 255 bytes'
        );
        _;
    }
    /**
     * @notice Check tag length constraints
     */
    modifier verifyTagLength (string memory _tag) {
        require(
            0 < bytes(_tag).length && bytes(_tag).length <= MAX_TAG_LENGTH,
            'Tag must not be empty or exceed 25 bytes'
        );
        _;
    }
    /**
     * @notice Check each document do not exceed the total number of tags
     */
    modifier verifyNumTags (uint tagCount) {
        require(
            tagCount < MAX_NUM_TAG,
            'Uploaded content have a limit of 10 tags each'
        );
        _;
    }

    /* Integrity Check Modifier */
    /**
     * @notice Checks if the document has been uploaded by the owner
     * @dev Documents can not be deleted, so the array will not contain gaps with empty info
     */
    modifier hasUploaded(uint documentIndex) { 
        require(
            documentIndex < documentsByUploader[msg.sender].length,
            'The content requested does not exist'
        );
        _;
    }

    /* State Modifying Functions */
    /**
     * @notice Creates a new document for the caller of this function
     * @dev DocumentCreated event emitted
     * @dev documentId generated using the keccak256 hash of the ipfs hash, which is longer than 32 bytes
     * @param _ipfsHash the ipfs hash of the document
     * @param _title the title of the document
     */
     function createDocument(string memory _ipfsHash, string memory _title, string memory _description)
        public
        whenNotPaused()
        verifyIPFSHash(_ipfsHash)
        verifyTitleLength(_title)
        verifyDescriptionLength(_description)
        {
            bytes32 _documentId = keccak256(abi.encodePacked(_ipfsHash));
            string storage ipfsHash = documentHashById[_documentId];
            // only create document if the content has not been uploaded before
            require(bytes(ipfsHash).length == 0, 'This content has previously been uploaded');
            // adding hash and metadata
            IterableMapping.itmap memory _tags;
            uint documentIndex = getNumberOfDocuments();
            documentsByUploader[msg.sender].push(DocumentMetadata(_documentId, _title, _description, _tags));
            documentHashById[_documentId] = _ipfsHash;

            emit DocumentCreated(_documentId, _ipfsHash, _title, _description, documentIndex);
        }

    /**
     * @notice Allow users to edit the title of a document they own
     * @dev TitleEdited event emitted
     * @param documentIndex The index of the document in the caller's document list
     * @param _title The new title to rename the document into
     */
     function editTitle(uint documentIndex, string memory _title)
        public
        whenNotPaused()
        hasUploaded(documentIndex)
        verifyTitleLength(_title)
    {
        string storage oldTitle = documentsByUploader[msg.sender][documentIndex].title;
        // emit event before changing the storage reference or else
        // oldTitle value will be pointing to the value of the new title
        emit TitleEdited(oldTitle, _title, now);
        
        documentsByUploader[msg.sender][documentIndex].title = _title;

    }

    function editDescription(uint documentIndex, string memory _description)
        public
        whenNotPaused()
        hasUploaded(documentIndex)
        verifyDescriptionLength(_description)
    {
        string storage oldDescription = documentsByUploader[msg.sender][documentIndex].title;
        emit DescriptionEdited(oldDescription, _description, now);

        documentsByUploader[msg.sender][documentIndex].title = _description;
    }

    /**
     * @notice Transforms string into a fixed bytes32 array
     * @dev String conversion to bytes32 not allowed as the string might truncate, use assembly
     * @param _tag The tag to convert to bytes32 array
     * @return A bytes32 array containing the tag 
     */
    function tagToFixedByteArray(string memory _tag) private pure returns (bytes32 tag) {
        assembly { tag := mload(add(_tag, 32)) }
    }

    /**
     * @notice Adds a tag to a document the caller owns
     * @dev To ensure uniqueness of tags, a tagId is generated using the keccak256 of the tag to map the tags
     * @dev TagAdded event emitted
     * @param documentIndex The index of the document in the caller's document list
     * @param _tag The tag the caller wants to put for a document
     */
    function addTag(uint documentIndex, string memory _tag)
        public
        whenNotPaused()
        verifyTagLength(_tag)
        hasUploaded(documentIndex)
        verifyNumTags(documentsByUploader[msg.sender][documentIndex].tags.size)
    {
        bytes32 tag = tagToFixedByteArray(_tag);
        IterableMapping.itmap storage tags = documentsByUploader[msg.sender][documentIndex].tags;
        // Prevent duplication of tags
        require(
            !tags.contains(tag),
            'This tag already exists for this content'
        );
        
        tags.insert(tag);

        emit TagAdded(_tag, tags.size, now);
    }

    /**
     * @notice Removes the tag for a caller's document by the contents of the tag
     * @dev TagRemoved event emitted
     * @param documentIndex The index of the document in the caller's document list
     * @param _tag The tag to be removed for the document
     */
    function removeTag(uint documentIndex, string memory _tag)
        public
        whenNotPaused()
        hasUploaded(documentIndex)
    {
        bytes32 tag = tagToFixedByteArray(_tag);
        IterableMapping.itmap storage tags = documentsByUploader[msg.sender][documentIndex].tags;
        // Only delete if this tag has been added before
        require(
            tags.contains(tag),
            'This tag does not exist for this content'
        );
        // Delete tag from map
        tags.remove(tag);

        emit TagRemoved(_tag, tags.size, now);
    }

    /* View Functions */
    /**
     * @notice Gets the number of documents the caller has uploaded
     * @return Number of documents created by caller
     */
    function getNumberOfDocuments() public view returns (uint) {
         return documentsByUploader[msg.sender].length;
    }

    /**
     * @notice Gets data for a document in the caller's document list
     * @param documentIndex The index of the document in the caller's document list
     * @return The document id, title, description and ipfs hash the document specified
     */
     function getDocument(uint documentIndex)
        public
        view
        hasUploaded(documentIndex)
        returns (
            bytes32 _documentId,
            string memory _title,
            string memory _description,
            string memory _ipfsHash
        )
    {
        bytes32 documentId = documentsByUploader[msg.sender][documentIndex].documentId;
        string storage title = documentsByUploader[msg.sender][documentIndex].title;
        string storage description = documentsByUploader[msg.sender][documentIndex].description;
        string storage ipfsHash = documentHashById[documentId];
        return (documentId, title, description, ipfsHash);
    }

    /**
     * @notice Gets the number of tags for a specific document
     * @param documentIndex The index of the document in the caller's document list
     * @return Number tags in a document created by caller
     */
    function getNumberOfTags(uint documentIndex) 
        public
        view
        hasUploaded(documentIndex)
        returns (uint tagIndex) 
    {
        IterableMapping.itmap storage tags = documentsByUploader[msg.sender][documentIndex].tags;
        return tags.size;
    }

    /**
     * @notice Gets data for a document in the caller's document list
     * @param documentIndex The index of the document in the caller's document list
     * @param tagIndex The index of the tag in the document specified by the caller
     * @return The tag id and tag string
     */
    function getTagByIndex(uint documentIndex, uint tagIndex)
        public
        view
        hasUploaded(documentIndex)
        returns (bytes32 tag, bool exists)
    {
        IterableMapping.itmap storage tags = documentsByUploader[msg.sender][documentIndex].tags;
        require(
            tags.valid(tagIndex),
            'Tag index out of bounds'
        );
        return tags.get(tagIndex);     
    }

    /**
     * @notice Returns whether the tag index is within bounds
     * @dev This checks if the tag index is smaller than the array length of all tags, including deleted ones
     * @param documentIndex The index of the document in the caller's document list
     * @param tagIndex The tag index to check if it is valid
     * @return boolean, true for valid tag, false for invalid
     */
    function validTagIndex(uint documentIndex, uint tagIndex)
    public
    view
    hasUploaded(documentIndex)
    returns (bool) {
        IterableMapping.itmap storage tags = documentsByUploader[msg.sender][documentIndex].tags;

        return tags.valid(tagIndex);
    }
}