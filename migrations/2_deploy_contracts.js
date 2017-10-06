const ICO = artifacts.require("./ICO.sol");
const MSig = artifacts.require("./installed/wallet.sol");

module.exports = (deployer, network) => {
  if (network === "development") {
    const team = web3.eth.accounts[0];
    deployer.deploy(ICO, team);
  }
  else if (network === "ropsten") {
    const team =  [ "0x3D4058006004d4A00cd562BC34EaD0e61AcF9593" , "0xa73a6822EbF4b3d1930871408b1456186083bC46" , "0x3f799D9f7104B4Ca31A048aba98cd494Ecd4ED09" ];
    const requiredConfirmations = 2;

    deployer.deploy(MSig, team, requiredConfirmations)
      .then(MSig.deployed)
      .then(msig => deployer.deploy(ICO, msig.address));
  }
  else if (network === "office") {
    const team =  [ "0x3D4058006004d4A00cd562BC34EaD0e61AcF9593" , "0xa73a6822EbF4b3d1930871408b1456186083bC46" , "0x3f799D9f7104B4Ca31A048aba98cd494Ecd4ED09" ];
    const requiredConfirmations = 2;

    deployer.deploy(MSig, team, requiredConfirmations)
      .then(MSig.deployed)
      .then(msig => deployer.deploy(ICO, msig.address));
  }
};
