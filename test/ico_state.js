const PKT = artifacts.require("./PKT.sol");
const ICO = artifacts.require("./PlaykeyICO.sol");

const ether1 = web3.toWei('1', 'ether');
const [team, foundation, advisors, bounty, investor] = web3.eth.accounts;


contract("ico created", () => {

  let ico;

  it("should be able to initialize ico", async () => {
    ico = await ICO.deployed();
  });

  it("should fail withdrawEther", async () => {
    try {
      await ico.withdrawEther(1, {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("withdrawEther is not failed");
  });

  it("should fail buyFor", async () => {
      try {
        await ico.buyFor(investor, {value: ether1});
      } catch(e) { if (e.name == 'Error') return true; throw e; }
      throw new Error("buyFor is not failed");
  });

  it("should fail transaction", async () => {
    try {
      await web3.eth.sendTransaction({from: investor, to: ico.address, value: ether1})
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("transaction is not failed");
  });

  it("should fail pauseIco", async () => {
    try {
      await ico.pauseIco();
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("pauseIco is not failed");
  });

  it("should fail finishIco", async () => {
    try {
      await ico.finishIco(team, foundation, advisors, bounty);
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("finishIco is not failed");
  });

  it("should fail mintForEarlyInvestors from foreigner address", async () => {
    try {
      await ico.mintForEarlyInvestors([bounty], [1], {from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("mintForEarlyInvestors is not failed");
  });

  it("should be able mintForEarlyInvestors", async () => {
    await ico.mintForEarlyInvestors([bounty], [1], {from: team});
  });

  it("should fail startIco from foreigner address", async () => {
    try {
      await ico.startIco({from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("startIco is not failed");
  });

  it("should be able to startIco", async () => {
    await ico.startIco({from: team});
  });
})


contract("ico running", () => {

  let ico;

  it("should be able to initialize ico", async () => {
    ico = await ICO.deployed();
  });

  it("should be able to startIco", async () => {
    await ico.startIco({from: team});
  });

  it("should fail second startIco call", async () => {
    try {
      await ico.startIco({from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("second startIco call is not failed");
  });

  it("should fail mintForEarlyInvestors", async () => {
    try {
      await ico.mintForEarlyInvestors([bounty], [1], {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("mintForEarlyInvestors is not failed");
  });

  it("should be able buyFor", async () => {
      await ico.buyFor(investor, {value: ether1});
  });

  it("should be able transaction", async () => {
    await web3.eth.sendTransaction({from: investor, to: ico.address, value: ether1})
  });

  it("should fail withdrawEther from foreigner address", async () => {
    try {
      await ico.withdrawEther(1, {from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("withdrawEther is not failed");
  });

  it("should be able withdrawEther", async () => {
    await ico.withdrawEther(1, {from: team});
  });

  it("should fail pauseIco from foreigner address", async () => {
    try {
      await ico.pauseIco({from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("pauseIco is not failed");
  });

  it("should fail finishIco from foreigner address", async () => {
    try {
      await ico.finishIco({from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("finishIco is not failed");
  });

  it("should be able to pauseIco", async () => {
    await ico.pauseIco({from: team});
  });

  it("should be able to startIco after pause", async () => {
    await ico.startIco({from: team});
  });

  it("should be able to pauseIco again", async () => {
    await ico.pauseIco({from: team});
  });

  it("should be able to startIco after pause", async () => {
    await ico.startIco({from: team});
  });

  it("should be able to finishIco", async () => {
    await ico.finishIco(team, foundation, advisors, bounty, {from: team});
  });
})

contract("ico paused", () => {

  let ico;

  it("should be able to initialize ico", async () => {
    ico = await ICO.deployed();
  });

  it("should be able to startIco", async () => {
    await ico.startIco({from: team});
  });

  it("should be able buyFor", async () => {
      await ico.buyFor(investor, {value: ether1});
  });

  it("should be able to pauseIco", async () => {
    await ico.pauseIco({from: team});
  });

  it("should fail second pauseIco call", async () => {
    try {
      await ico.pauseIco({from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("second pauseIco call is not failed");
  });

  it("should fail buyFor", async () => {
    try {
      await ico.buyFor(investor, {value: ether1});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("buyFor is not failed");
  });

  it("should fail transaction", async () => {
    try {
      await web3.eth.sendTransaction({from: investor, to: ico.address, value: ether1})
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("transaction is not failed");
  });

  it("should fail mintForEarlyInvestors", async () => {
    try {
      await ico.mintForEarlyInvestors([bounty], [1], {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("mintForEarlyInvestors is not failed");
  });

  it("should fail withdrawEther from foreigner address", async () => {
    try {
      await ico.withdrawEther(1, {from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("withdrawEther is not failed");
  });

  it("should be able withdrawEther", async () => {
    await ico.withdrawEther(1, {from: team});
  });

  it("should fail finishIco from foreigner address", async () => {
    try {
      await ico.finishIco({from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("finishIco is not failed");
  });

  it("should be able to finishIco", async () => {
    await ico.finishIco(team, foundation, advisors, bounty, {from: team});
  });
})


contract("ico finished", () => {

  let ico;

  it("should be able to initialize ico", async () => {
    ico = await ICO.deployed();
  });

  it("should be able to startIco", async () => {
    await ico.startIco({from: team});
  });

  it("should be able buyFor", async () => {
      await ico.buyFor(investor, {value: ether1});
  });

  it("should be able to finishIco", async () => {
    await ico.finishIco(team, foundation, advisors, bounty, {from: team});
  });

  it("should fail second finishIco call", async () => {
    try {
      await ico.finishIco(team, foundation, advisors, bounty, {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("second finishIco call is not failed");
  });

  it("should fail buyFor", async () => {
    try {
      await ico.buyFor(investor, {value: ether1});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("buyFor is not failed");
  });

  it("should fail transaction", async () => {
    try {
      await web3.eth.sendTransaction({from: investor, to: ico.address, value: ether1})
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("transaction is not failed");
  });

  it("should fail mintForEarlyInvestors", async () => {
    try {
      await ico.mintForEarlyInvestors([bounty], [1], {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("mintForEarlyInvestors is not failed");
  });

  it("should fail withdrawEther from foreigner address", async () => {
    try {
      await ico.withdrawEther(1, {from: investor});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("withdrawEther is not failed");
  });

  it("should be able withdrawEther", async () => {
    await ico.withdrawEther(1, {from: team});
  });

  it("should fail startIco", async () => {
    try {
      await ico.startIco({from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("startIco is not failed");
  });

  it("should fail pauseIco", async () => {
    try {
      await ico.pauseIco({from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("pauseIco is not failed");
  });
})
