let FCS = artifacts.require("./FCSdeal.sol");
let FCSsource = artifacts.require("./FCSsource.sol");//TODO remove > not required to deploy

module.exports = function(deployer) {
  deployer.deploy(FCS);
  deployer.deploy(FCSsource, "0x05a7720136ef54d015c7d113aa3eba0d081d7aaf");
};
