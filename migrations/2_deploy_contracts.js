let FCS = artifacts.require("./FCSdeal.sol");
let FCSsource = artifacts.require("./FCSsource.sol");//TODO remove > not required to deploy

module.exports = function(deployer) {
  deployer.deploy(FCS);
  deployer.deploy(FCSsource);
};
