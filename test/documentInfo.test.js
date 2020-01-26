var DocumentInfo = artifacts.require('DocumentInfo')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('DocumentInfo', function(accounts) {

    const deployAccount = accounts[0]
    const firstAccount = accounts[1]
    const secondAccount = accounts[2]
    const thirdAccount = accounts[3]

    let instance

    const deployAccDocument1 = {
        ipfsHash: "QmdQ1rHHHTbgbGorfuMMYDQQ36q4sxvYcB4GDEHREuJQkL",
        title: "hello world"
    }

    const deployAccDocument2 = {
        ipfsHash: "QmbUSy8HCn8J4TMDRRdxCbK2uCCtkQyZtY6XYv3y7kLgDC",
        title: "title 2"
    }

    const deployAccDocument3 = {
        ipfsHash: "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        title: "title 1"
    }

    const firstAccDocument1 = {
        ipfsHash: "QmdQ1rHHHTbgbGorfuMMYDQQ36q4sxvYcB4GDEHREuJQkL",
        title: "The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the l"
    }

    const secondAccDocument1 = {
        ipfsHash: "QmdQ1rHHHTbgbGorfuMMYDQQ36q4sxvYcB4GDEHREuJQkL",
        title: "hello world"
    }

    const thirdAccDocument1 = {
        ipfsHash: "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu",
        title: "title 1"
    }

    const tagNumLimit = 10

    beforeEach(async () => {
        instance = await DocumentInfo.new()
    })

    describe("createDocument()", async() => {
        it("adding a document should emit an event with document details", async() => {
            const tx = await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            const eventData = tx.logs[0].args

            assert.equal(eventData.documentId, web3.utils.keccak256(deployAccDocument1.ipfsHash), "the document id should match to the keccak256 hash of the ipfs hash")
            assert.equal(eventData.ipfsHash, deployAccDocument1.ipfsHash, "the added ipfs hashes should match")
            assert.equal(eventData.title, deployAccDocument1.title, "the added titles should match")        
        })

        it("document can only be added if the length of the ipfs string is not empty", async() => {
            await catchRevert(instance.createDocument("", deployAccDocument1.title, {from: deployAccount} ))       
        })

        it("document can only be added if the length of the title string is not empty", async() => {
            await catchRevert(instance.createDocument(deployAccDocument1.ipfsHash, "", {from: deployAccount} ))
        })

        it("document can only be added if the title does not exceed the length limit", async() => {
            await catchRevert(instance.createDocument(firstAccDocument1.ipfsHash, firstAccDocument1.title, {from: firstAccount} ))
        })

        it("document can only be added if the same content has not been added before", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            await catchRevert(instance.createDocument(secondAccDocument1.ipfsHash, secondAccDocument1.title, {from: secondAccount} ))
        })
    })

    describe("editTitle()", async() => {
        it("editing the title should emit an event with the tag details", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            
            const tx = await instance.editTitle(0, "hello world 2", {from: deployAccount} )
            const eventData = tx.logs[0].args
            const block = await web3.eth.getBlock(tx.logs[0].blockNumber)
            const timestamp = block.timestamp

            assert.equal(eventData.oldTitle, deployAccDocument1.title, "the old titles should match")
            assert.equal(eventData.newTitle, "hello world 2", "the new titles should match")
            assert.equal(eventData.timeEdited.toString(), timestamp, "the times edited should match")
        })

        it("the title can only be edited if the document has been created by the caller", async() => {
            await catchRevert(instance.editTitle(0, "hello world", {from: deployAccount} ))
        })

        it("the title can only be edited by the creator of the document", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            await catchRevert(instance.editTitle(0, "hello world", {from: secondAccount} ))
        })
    })

    describe("addTag()", async() => {
        it("adding the tag should emit an event with the edit details", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            
            const tx = await instance.addTag(0, "tag 1", {from: deployAccount} )
            const eventData = tx.logs[0].args
            const block = await web3.eth.getBlock(tx.logs[0].blockNumber)
            const timestamp = block.timestamp

            assert.equal(eventData.tag, "tag 1", "the tag strings should match")
            assert.equal(eventData.tagCount, 1, "the tag counts should match")
            assert.equal(eventData.timeAdded, timestamp, "the times edited should match")
        })

        it("tag can only be added if its length is not zero", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )

            await catchRevert(instance.addTag(0, "", {from: deployAccount} ))
        })

        it("tag can only be added if it within the length limit", async() => {
            const tag = "very-long-tag-that-exceeds-limit!"
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )

            await catchRevert(instance.addTag(0, tag, {from: deployAccount} ))
        })

        it("tag can only be added if the document exists and has been created by the caller", async() => {
            await catchRevert(instance.addTag(0, "tag 1", {from: deployAccount} ))
        })

        it("tag can not be added if the total number of tags exceeds the tag limit", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )

            let i = 0
            while (i < tagNumLimit) {
                await instance.addTag(0, "tag " + i, {from: deployAccount})
                i++
            }

            catchRevert(instance.addTag(0, "tag 11", {from: deployAccount}))
        })

        it("tag can only be added if the same tag has not been added before", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            await instance.addTag(0, "tag 1", {from: deployAccount} )

            await catchRevert(instance.addTag(0, "tag 1", {from: deployAccount} ))
        })
    })

    describe("removeTag()", async() => {
        it("removing the tag should emit an event with the tag details", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            await instance.addTag(0, "tag 1", {from: deployAccount} )
            await instance.addTag(0, "tag 2", {from: deployAccount} )

            const tx = await instance.removeTag(0, "tag 1", {from: deployAccount} )
            const eventData = tx.logs[0].args
            const block = await web3.eth.getBlock(tx.logs[0].blockNumber)
            const timestamp = block.timestamp

            assert.equal(eventData.tag, "tag 1", "the tag strings should match")
            assert.equal(eventData.tagCount, 1, "the tag counts should match")
            assert.equal(eventData.timeRemoved, timestamp, "the times edited should match")
        })

        it("tag can only be removed if it is in the list of tags added to a document", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            await instance.addTag(0, "tag 1", {from: deployAccount} )
            
            await catchRevert(instance.removeTag(0, "tag 2", {from: deployAccount} ))
        })

        it("tag can only be removed if the document has been created by the caller", async() => {
            catchRevert(instance.removeTag(0, "tag 1", {from: deployAccount} ))
        })
    })

    describe("getNumberOfDocuments()", async() => {
        it("gets the correct number of documents the caller has created", async() =>  {
            const deployAccDocumentNum = 3
            const secondAccDocumentNum = 0
            const thirdAccDocumentNum = 1
            const assertString = "should return the number of documents msg.sender has created"

            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            await instance.createDocument(deployAccDocument2.ipfsHash, deployAccDocument2.title, {from: deployAccount} )
            await instance.createDocument(deployAccDocument3.ipfsHash, deployAccDocument3.title, {from: deployAccount} )
            await instance.createDocument(thirdAccDocument1.ipfsHash, thirdAccDocument1.title, {from: thirdAccount} )
            
            let result = await instance.getNumberOfDocuments({from: deployAccount})
            assert.equal(result, deployAccDocumentNum, assertString)

            result = await instance.getNumberOfDocuments({from: secondAccount})
            assert.equal(result, secondAccDocumentNum, assertString)

            result = await instance.getNumberOfDocuments({from: thirdAccount})
            assert.equal(result, thirdAccDocumentNum, assertString)
        })
    })

    describe("getDocument()", async() => {
        it("providing a documentIndex returns data for the caller's document except tags", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            await instance.createDocument(deployAccDocument2.ipfsHash, deployAccDocument2.title, {from: deployAccount} )
            const documentDetails = await instance.getDocument(1)

            assert.equal(documentDetails[0], web3.utils.keccak256(deployAccDocument2.ipfsHash), "the document id should match")
            assert.equal(documentDetails[1], deployAccDocument2.title, "the title should match")
            assert.equal(documentDetails[2], deployAccDocument2.ipfsHash, "the ipfs hash should match")
        })

        it("document can only been retrived if the caller has created it", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )

            await catchRevert(instance.getDocument(0, {from: firstAccount}))
        })
    })

    describe("getNumberOfTags()", async() => {
        it("providing a document index, returns the number of tags for that document", async() => {
            const numTag1 = 9
            const numTag2 = 0
            const assertString = "should return the number of tags for the requested document"

            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            let i = 0
            while (i < tagNumLimit) {
                await instance.addTag(0, "tag " + i, {from: deployAccount})
                i++
            }
            await instance.removeTag(0, "tag 7", {from: deployAccount})

            await instance.createDocument(deployAccDocument2.ipfsHash, deployAccDocument2.title, {from: deployAccount} )

            let result = await instance.getNumberOfTags(0, {from: deployAccount})
            assert.equal(result, numTag1, assertString)
            result = await instance.getNumberOfTags(1, {from: deployAccount})
            assert.equal(result, numTag2, assertString)
        })

        it("number of tags can only be retrieved if the document exists", async() => {
            await catchRevert(instance.getNumberOfTags(0, {from: deployAccount}))
        })
    })

    describe("getTagByIndex()", async() => {
        it("providing a document index and tag index should return the tag and if it has not been deleted", async() => {
            const tag1 = web3.utils.padRight(web3.utils.utf8ToHex('100 €'), 64)
            const tag2 = web3.utils.padRight(web3.utils.utf8ToHex('2000 €'), 64)

            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            await instance.addTag(0, "100 €", {from: deployAccount} )
            await instance.addTag(0, "2000 €", {from: deployAccount} )
            await instance.removeTag(0, "100 €", {from: deployAccount} )

            let tagDetails = await instance.getTagByIndex(0, 0, {from: deployAccount} )
            assert.equal(tagDetails[0], tag1, "the tag contents should match")
            assert.equal(tagDetails[1], false, "tag 1 should not exist because it is deleted")

            tagDetails = await instance.getTagByIndex(0, 1, {from: deployAccount} )
            assert.equal(tagDetails[0], tag2, "the tag contents should match")
            assert.equal(tagDetails[1], true, "tag 2 should exist because because it has not been deleted")
        })

        it("tag can only be retrieved by its index if the document exists", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )

            await catchRevert(instance.getTagByIndex(1, 0, {from: deployAccount} ))
        })

        it("tag can only be retrieved if the tag index is not out of bounds", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            await instance.addTag(0, "tag 1", {from: deployAccount} )

            await catchRevert(instance.getTagByIndex(0, 1, {from: deployAccount} ))
        })
    })

    describe("validTagIndex", async() => {
        it("providing a document and tag index will check if the tag index is not out of bounds", async() => {
            await instance.createDocument(deployAccDocument1.ipfsHash, deployAccDocument1.title, {from: deployAccount} )
            await instance.addTag(0, "tag 1", {from: deployAccount} )
            await instance.addTag(0, "tag 2", {from: deployAccount} )
            await instance.removeTag(0, "tag 2", {from: deployAccount} )

            let validTag = await instance.validTagIndex(0, 0)
            assert.equal(validTag, true, "tag index should be valid because tag was added to the document")

            validTag = await instance.validTagIndex(0, 1)
            assert.equal(validTag, true, "tag index should be valid even if the tag was deleted")

            validTag = await instance.validTagIndex(0, 2)
            assert.equal(validTag, false, "tag index should not be valid as it is out of bounds")
        })
    })
})