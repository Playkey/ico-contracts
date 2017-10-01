const ICO = artifacts.require("./ICO.sol");
const MSig = artifacts.require("./installed/wallet.sol");

module.exports = (deployer, network) => {
  if (network === "development") {
    const team = web3.eth.accounts[0];
    deployer.deploy(ICO, team);
  }
  else {
    // const team =  [ "0xCf8Ff2ad1Bda418d6602c0eDd018Ac6505E242fb" , "0x533Bc61cbD387839c62602eA5C74e3CE67a59a47" , "0x139676600Fd888Ff97bA7F88598c94BA5C6b365e" ];
    // const requiredConfirmations = 2;
    //
    // deployer.deploy(MSig, team, requiredConfirmations)
    //   .then(MSig.deployed)
    //   .then(msig => deployer.deploy(ICO, msig.address));
  }
};
