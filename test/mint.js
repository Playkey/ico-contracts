const PKT = artifacts.require("./PKT.sol");
const ICO = artifacts.require("./ICO.sol");

const ether1 = web3.toWei('1', 'ether');
const [team, foundation, advisors, bounty, investor] = web3.eth.accounts;

contract("mint", () => {

  let ico;
  let pkt;
  let tokenLimit;

  it("should mint all tokens for sale with 35% discount", async () => {
    ico = await ICO.deployed();
    tokenLimit = await ico.tokenLimit.call();
    await ico.mintForEarlyInvestor(investor, 156000 * ether1, {from: team});
  });

  it("should be able to startIco", async () => {
    await ico.startIco({from: team});
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

  it("should be able to finishIco", async () => {
    await ico.finishIco(team, foundation, advisors, bounty, {from: team});
  });

  it("should be able to get token contract", async () => {
    await ico.pkt.call().then(addr => pkt = PKT.at(addr));
  });

  it("should be 20% tokens for team", async () => {
    let balance = await pkt.balanceOf(team);
    assert.equal(tokenLimit.mul(0.2).toFixed(), balance.toFixed());
  });

  it("should be 12.5% tokens for foundation", async () => {
    let balance = await pkt.balanceOf(foundation);
    assert.equal(tokenLimit.mul(0.125).toFixed(), balance.toFixed());
  });

  it("should be 6% tokens for advisors", async () => {
    let balance = await pkt.balanceOf(advisors);
    assert.equal(tokenLimit.mul(0.06).toFixed(), balance.toFixed());
  });

  it("should be 1.5% tokens for bounty", async () => {
    let balance = await pkt.balanceOf(bounty);
    assert.equal(tokenLimit.mul(0.015).toFixed(), balance.toFixed());
  });
})
