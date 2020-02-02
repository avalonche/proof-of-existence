const DocumentInfo = artifacts.require("DocumentInfo");

module.exports = function(deployer) {
  deployer.deploy(DocumentInfo);
};