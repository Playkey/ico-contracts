const ICO = artifacts.require("./PlaykeyICO.sol");
const MSig = artifacts.require("./installed/MultiSigWallet.sol");

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
    const team =  [ "0xD0efEC4aF19bc3D468D4E9271AC462C4169440c2" , "0x0db11bc3c1538f274ad23b626253d951394834b1" , "0x5b4df46f7b715c208ad2b26be93aa30fbdfab80b" ];
    const requiredConfirmations = 2;

    deployer.deploy(MSig, team, requiredConfirmations)
      .then(MSig.deployed)
      .then(msig => deployer.deploy(ICO, msig.address));
  }
};
