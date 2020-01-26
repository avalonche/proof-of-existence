const ProofOfExistence = artifacts.require("ProofOfExistence");
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('ProofOfExistence', function(accounts) {

    const deployAccount = accounts[0]
    const firstAccount = accounts[1]

    let instance

    const deployAccDocument1 = "QmdQ1rHHHTbgbGorfuMMYDQQ36q4sxvYcB4GDEHREuJQkL"

    const deployAccDocument2 = "QmbUSy8HCn8J4TMDRRdxCbK2uCCtkQyZtY6XYv3y7kLgDC"

    const deployAccDocument3 = "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq"

    const firstAccDocument1 = "QmdQ1rHHHTbgbGorfuMMYDQQ36q4sxvYcB4GDEHREuJQkL"

    const firstAccDocument2 = "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu"

    beforeEach(async () => {
        instance = await ProofOfExistence.new()
    })

    describe("uploadDocument()", async() => {
        it("uploading a document should log document details", async() => {
            const tx = await instance.uploadDocument(deployAccDocument1, {from: deployAccount} )
            const blockNumber = tx.logs[0].blockNumber
            const block = await web3.eth.getBlock(blockNumber)
            const timestamp = block.timestamp.toString()
            const eventData = tx.logs[0].args

            assert.equal(eventData.ipfsHash, deployAccDocument1)
            assert.equal(eventData.blockNumber, blockNumber)
            assert.equal(eventData.uploadTime, timestamp)
            assert.equal(eventData.uploader, deployAccount)
        })

        it("document can only be added if the IPFS hash is of valid length", async() => {
            await catchRevert(instance.uploadDocument("", {from: deployAccount}))
        })

        it("document can only be added if it has not already been uploaded", async() => {
            await instance.uploadDocument(deployAccDocument1, {from: deployAccount} )

            await catchRevert(instance.uploadDocument(deployAccDocument1, {from: deployAccount} ))
            await catchRevert(instance.uploadDocument(deployAccDocument1, {from: firstAccount} ))
        })

        it("document can only be added if it is not paused by the owner", async() => {
            await instance.toggleContractActive( {from: deployAccount} )
            await catchRevert(instance.uploadDocument(deployAccDocument1, {from: deployAccount} ))
            await catchRevert(instance.uploadDocument(firstAccDocument1, {from: firstAccount} ))
        })
    })

    describe("numDocuments()", async() => {
        it("document count should be initialized at zero", async() => {
            const numDoc = await instance.numDocuments( {from: firstAccount} )
            assert.equal(numDoc, 0, "the document count should be initialized to 0")
        })

        it("document count should increment along with each document upload", async() => {
            await instance.uploadDocument(deployAccDocument1, {from: deployAccount} )
            await instance.uploadDocument(deployAccDocument2, {from: deployAccount} )
            await instance.uploadDocument(deployAccDocument3, {from: deployAccount} )
            await instance.uploadDocument(firstAccDocument2, {from: firstAccount} )

            const numDoc = await instance.numDocuments()
            assert.equal(numDoc, 4, "the document should equal to 4, the number uploaded")
        })
    })

    describe("verifyDocument()", async() => {
        it("verifying a document should return the document details", async() => {
            const documentDetails = await instance.uploadDocument(deployAccDocument1, {from: deployAccount} )
            const blockNumber = documentDetails.logs[0].blockNumber
            const block = await web3.eth.getBlock(blockNumber)
            const timestamp = block.timestamp
            await instance.uploadDocument(deployAccDocument2, {from: deployAccount} )
            await instance.uploadDocument(firstAccDocument2, {from: firstAccount} )
            const verifyDetails = await instance.verifyDocument(deployAccDocument1, {from: firstAccount} )

            assert.equal(verifyDetails[0].toString(), blockNumber, "the values of the block number should match")
            assert.equal(verifyDetails[1].toString(), timestamp, "the values of the timestamps should match")
            assert.equal(verifyDetails[2], deployAccount, "the address of the uploader should match")
        })

        it("document can not be verified if it has not been uploaded before", async() => {
            await instance.uploadDocument(deployAccDocument1, {from: deployAccount} )
            await catchRevert(instance.verifyDocument(firstAccDocument2, {from: deployAccount} ))
        })

        it("document can be verified even if the circuit breaker is turned on", async() => {
            await instance.uploadDocument(deployAccDocument1, {from: deployAccount} )
            await instance.toggleContractActive( {from: deployAccount} )
            await instance.verifyDocument(deployAccDocument1, {from: firstAccount} )
        })
    })

    describe("toggleContractActive()", async() => {
        it("circuit breaker can only be turned on and off by the deploy account", async() => {
            await catchRevert(instance.toggleContractActive( {from: firstAccount} ))
        })
    })
})