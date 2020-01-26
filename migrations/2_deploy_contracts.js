var ProofOfExistence = artifacts.require("ProofOfExistence");
var DocumentInfo = artifacts.require("DocumentInfo");

module.exports = function(deployer) {
    deployer.deploy(ProofOfExistence);
    deployer.deploy(DocumentInfo);
};