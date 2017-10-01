const PKT = artifacts.require("./PKT.sol");
const ICO = artifacts.require("./ICO.sol");

const ether1 = web3.toWei('1', 'ether');
const gas = 50000;
const gasLimit = 21000;
const gasPrice = web3.eth.gasPrice;
const [team, foundation, advisors, bounty, investor] = web3.eth.accounts;


contract("ico created", () => {

  it("should fail withdrawEther", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.withdrawEther(1, {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("withdrawEther is not failed");
  });

  it("should fail buyFor", async () => {
      let ico = await ICO.deployed();
      try {
        await ico.buyFor(investor, {value: ether1});
      } catch(e) { if (e.name == 'Error') return true; throw e; }
      throw new Error("buyFor is not failed");
  });

  it("should fail transaction", async () => {
    let ico = await ICO.deployed();
    try {
      await web3.eth.sendTransaction({from: investor, to: ico.address,
        value: ether1, gas: gas, gasLimit: gasLimit, gasPrice: gasPrice})
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("transaction is not failed");
  });

  it("should fail pauseIco", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.pauseIco();
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("pauseIco is not failed");
  });

  it("should fail finishIco", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.finishIco(team, foundation, advisors, bounty);
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("finishIco is not failed");
  });

  it("should fail mintForEarlyInvestor from foreigner address", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.mintForEarlyInvestor(bounty, 1, {from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("mintForEarlyInvestor is not failed");
  });

  it("should be able mintForEarlyInvestor", async () => {
    let ico = await ICO.deployed();
    await ico.mintForEarlyInvestor(bounty, 1, {from: team});
  });

  it("should fail startIco from foreigner address", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.startIco({from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("startIco is not failed");
  });

  it("should be able to startIco", async () => {
    let ico = await ICO.deployed();
    await ico.startIco({from: team});
  });
})


contract("ico running", () => {

  it("should be able to startIco", async () => {
    let ico = await ICO.deployed();
    await ico.startIco({from: team});
  });

  it("should fail second startIco call", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.startIco({from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("second startIco call is not failed");
  });

  it("should fail mintForEarlyInvestor", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.mintForEarlyInvestor(bounty, 1, {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("mintForEarlyInvestor is not failed");
  });

  it("should be able buyFor", async () => {
      let ico = await ICO.deployed();
      await ico.buyFor(investor, {value: ether1});
  });

  it("should be able transaction", async () => {
    let ico = await ICO.deployed();
    await web3.eth.sendTransaction({from: investor, to: ico.address,
      value: ether1, gas: gas, gasLimit: gasLimit, gasPrice: gasPrice})
  });

  it("should fail withdrawEther from foreigner address", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.withdrawEther(1, {from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("withdrawEther is not failed");
  });

  it("should be able withdrawEther", async () => {
    let ico = await ICO.deployed();
    await ico.withdrawEther(1, {from: team});
  });

  it("should fail pauseIco from foreigner address", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.pauseIco({from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("pauseIco is not failed");
  });

  it("should fail finishIco from foreigner address", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.finishIco({from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("finishIco is not failed");
  });

  it("should be able to pauseIco", async () => {
    let ico = await ICO.deployed();
    await ico.pauseIco({from: team});
  });

  it("should be able to startIco after pause", async () => {
    let ico = await ICO.deployed();
    await ico.startIco({from: team});
  });

  it("should be able to pauseIco again", async () => {
    let ico = await ICO.deployed();
    await ico.pauseIco({from: team});
  });

  it("should be able to startIco after pause", async () => {
    let ico = await ICO.deployed();
    await ico.startIco({from: team});
  });

  it("should be able to finishIco", async () => {
    let ico = await ICO.deployed();
    await ico.finishIco(team, foundation, advisors, bounty, {from: team});
  });
})

contract("ico paused", () => {

  it("should be able to startIco", async () => {
    let ico = await ICO.deployed();
    await ico.startIco({from: team});
  });

  it("should be able buyFor", async () => {
      let ico = await ICO.deployed();
      await ico.buyFor(investor, {value: ether1});
  });

  it("should be able to pauseIco", async () => {
    let ico = await ICO.deployed();
    await ico.pauseIco({from: team});
  });

  it("should fail second pauseIco call", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.pauseIco({from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("second pauseIco call is not failed");
  });

  it("should fail buyFor", async () => {
      let ico = await ICO.deployed();
      try {
        await ico.buyFor(investor, {value: ether1});
      } catch(e) { if (e.name == 'Error') return true; throw e; }
      throw new Error("buyFor is not failed");
  });

  it("should fail transaction", async () => {
    let ico = await ICO.deployed();
    try {
      await web3.eth.sendTransaction({from: investor, to: ico.address,
        value: ether1, gas: gas, gasLimit: gasLimit, gasPrice: gasPrice})
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("transaction is not failed");
  });

  it("should fail mintForEarlyInvestor", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.mintForEarlyInvestor(bounty, 1, {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("mintForEarlyInvestor is not failed");
  });

  it("should fail withdrawEther from foreigner address", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.withdrawEther(1, {from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("withdrawEther is not failed");
  });

  it("should be able withdrawEther", async () => {
    let ico = await ICO.deployed();
    await ico.withdrawEther(1, {from: team});
  });

  it("should fail finishIco from foreigner address", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.finishIco({from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("finishIco is not failed");
  });

  it("should be able to finishIco", async () => {
    let ico = await ICO.deployed();
    await ico.finishIco(team, foundation, advisors, bounty, {from: team});
  });
})


contract("ico finished", () => {

  it("should be able to startIco", async () => {
    let ico = await ICO.deployed();
    await ico.startIco({from: team});
  });

  it("should be able buyFor", async () => {
      let ico = await ICO.deployed();
      await ico.buyFor(investor, {value: ether1});
  });

  it("should be able to finishIco", async () => {
    let ico = await ICO.deployed();
    await ico.finishIco(team, foundation, advisors, bounty, {from: team});
  });

  it("should fail second finishIco call", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.finishIco(team, foundation, advisors, bounty, {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("second finishIco call is not failed");
  });

  it("should fail buyFor", async () => {
      let ico = await ICO.deployed();
      try {
        await ico.buyFor(investor, {value: ether1});
      } catch(e) { if (e.name == 'Error') return true; throw e; }
      throw new Error("buyFor is not failed");
  });

  it("should fail transaction", async () => {
    let ico = await ICO.deployed();
    try {
      await web3.eth.sendTransaction({from: investor, to: ico.address,
        value: ether1, gas: gas, gasLimit: gasLimit, gasPrice: gasPrice})
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("transaction is not failed");
  });

  it("should fail mintForEarlyInvestor", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.mintForEarlyInvestor(bounty, 1, {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("mintForEarlyInvestor is not failed");
  });

  it("should fail withdrawEther from foreigner address", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.withdrawEther(1, {from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("withdrawEther is not failed");
  });

  it("should be able withdrawEther", async () => {
    let ico = await ICO.deployed();
    await ico.withdrawEther(1, {from: team});
  });

  it("should fail startIco", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.startIco({from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("startIco is not failed");
  });

  it("should fail pauseIco", async () => {
    let ico = await ICO.deployed();
    try {
      await ico.pauseIco({from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("pauseIco is not failed");
  });
})
