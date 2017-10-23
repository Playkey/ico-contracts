const PKT = artifacts.require("./PKT.sol");
const ICO = artifacts.require("./PlaykeyICO.sol");

const ether1 = web3.toWei('1', 'ether');
const [team, foundation, advisors, bounty, investor] = web3.eth.accounts;

const getTeamFund = (limit, sale, sold) => {
  return limit.sub(sale).mul(sold.div(sale)).add(sold);
}

contract("mint", () => {

  let ico;
  let pkt;
  let tokenLimit;
  let tokensForSale;
  let tokensSold;

  it("should be able to initialize ico", async () => {
    ico = await ICO.deployed();
    tokenLimit = await ico.tokenLimit();
    tokensForSale = await ico.tokensForSale();
  });

  it("should be able to get token contract", () => {
    ico.pkt.call().then(addr => pkt = PKT.at(addr));
  });

  it("should fail mintForEarlyInvestors for different arguments lengths", async () => {
    try {
      await ico.mintForEarlyInvestors([bounty], [1, 2], {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("mintForEarlyInvestors is not failed");
  });

  it("should fail mintForEarlyInvestors for address = 0x0", async () => {
    try {
      await ico.mintForEarlyInvestors(['0x0'], [1], {from: team});
    } catch(e) { if (e.name == 'Error') return true; throw e; }
    throw new Error("mintForEarlyInvestors is not failed");
  });

  it("should mint all tokens for sale with 35% discount", async () => {
    await ico.mintForEarlyInvestors([investor], [156000 * ether1], {from: team});
    tokensSold = await pkt.totalSupply();
    assert.equal(tokensForSale.toFixed(), tokensSold.toFixed());
  });

  it("should be 60% tokens on investor balance", async () => {
    let balance = await pkt.balanceOf(investor);
    assert.equal(tokenLimit.mul(0.6).toFixed(), balance.toFixed());
  });

  it("should be able to startIco", async () => await ico.startIco({from: team}));

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

  it("should be able to finishIco", async () => {
    await ico.finishIco(team, foundation, advisors, bounty, {from: team});
  });

  const checkBalance = async (address, percent) => {
    let balance = await pkt.balanceOf(address);
    let teamFund = getTeamFund(tokenLimit, tokensForSale, tokensSold);
    assert.equal(teamFund.mul(percent).toFixed(), balance.toFixed());
  };

  it("should be 20% tokens for team", () => checkBalance(team, 0.2));
  it("should be 12.5% tokens for foundation", () => checkBalance(foundation, 0.125));
  it("should be 6% tokens for advisors", () => checkBalance(advisors, 0.06));
  it("should be 1.5% tokens for bounty", () => checkBalance(bounty, 0.015));
})


contract("mint 50%", () => {

  let ico;
  let pkt;
  let tokenLimit;
  let tokensForSale;
  let tokensSold;

  it("should be able to initialize ico", async () => {
    ico = await ICO.deployed();
    tokenLimit = await ico.tokenLimit();
    tokensForSale = await ico.tokensForSale();
  });

  it("should be able to get token contract", () => {
    ico.pkt.call().then(addr => pkt = PKT.at(addr));
  });

  it("should mint 50 % tokens with 35% discount", async () => {
    await ico.mintForEarlyInvestors([investor], [78000 * ether1], {from: team});
    tokensSold = await pkt.totalSupply();
    assert.equal(tokensForSale.mul(0.5).toFixed(), tokensSold.toFixed());
  });

  it("should be able to startIco", async () => await ico.startIco({from: team}));

  it("should be able to finishIco", async () => {
    await ico.finishIco(team, foundation, advisors, bounty, {from: team});
  });

  const checkBalance = async (address, percent) => {
    let balance = await pkt.balanceOf(address);
    let teamFund = getTeamFund(tokenLimit, tokensForSale, tokensSold);
    assert.equal(teamFund.mul(percent).toFixed(), balance.toFixed());
  };

  it("should be 20% tokens for team", () => checkBalance(team, 0.2));
  it("should be 12.5% tokens for foundation", () => checkBalance(foundation, 0.125));
  it("should be 6% tokens for advisors", () => checkBalance(advisors, 0.06));
  it("should be 1.5% tokens for bounty", () => checkBalance(bounty, 0.015));
})


contract("mint for", () => {

  let ico;
  let pkt;

  it("should be able to initialize ico", async () => ico = await ICO.deployed());

  it("should be able to get token contract", () => {
    ico.pkt.call().then(addr => pkt = PKT.at(addr));
  });

  const checkBalance = async (address, balance) => {
    let res = await pkt.balanceOf(address);
    assert.equal(balance.toFixed(), res.toFixed());
  }

  const checkMintFor = async (address, value) => {
    await ico.mintFor(address, value);
    await checkBalance(address, value);
  };

  it("should mint 10 tokens", () => checkMintFor(team, 10));
  it("should be able to startIco", async () => await ico.startIco({from: team}));
  it("should mint 20 tokens", () => checkMintFor(foundation, 20));
  it("should be able to pauseIco", async () => await ico.pauseIco({from: team}));
  it("should mint 30 tokens", () => checkMintFor(advisors, 30));
  it("should be able to finishIco", async () => {
    await ico.finishIco(team, foundation, advisors, bounty, {from: team});
  });
})
