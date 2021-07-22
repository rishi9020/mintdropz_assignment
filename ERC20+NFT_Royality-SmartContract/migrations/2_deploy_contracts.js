const MintdropzTOKEN = artifacts.require("MintdropzTOKEN");
const MintdropzNFT = artifacts.require("MintdropzNFT");

module.exports = function(deployer) {
  deployer.deploy(MintdropzTOKEN)
  .then(function() {
    return deployer.deploy(MintdropzNFT, MintdropzTOKEN.address);;
  })
};
