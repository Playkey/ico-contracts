const PKT = artifacts.require("./PKT.sol");
const ICO = artifacts.require("./PlaykeyICO.sol");

contract("bonus pattern", () => {

  const tokensForSale = new web3.BigNumber("1e18").mul(100000000).mul(0.6);

  const [team] = web3.eth.accounts;
  let ico;

  it("should be able to create ICO", () =>
    ICO.new(team).then(res => {
      assert.isOk(res && res.address, "has invalid address");
      ico = res;
    })
  );

  // Bonus
  const checkBonus = (sold, value, bonus) =>
    ico.getBonus.call(value, tokensForSale.mul(sold).toFixed())
      .then(res => assert.equal(bonus.toFixed(), res.toFixed()));

  it("should get bonus for the 1st 10% tokens", () => checkBonus(0, 1000, 150));
  it("should get bonus for the 2nd 10% tokens", () => checkBonus(0.1, 1000, 125));
  it("should get bonus for the 3rd 10% tokens", () => checkBonus(0.2, 1000, 100));
  it("should get bonus for the 4th 10% tokens", () => checkBonus(0.3, 1000,  75));
  it("should get bonus for the 5th 10% tokens", () => checkBonus(0.4, 1000,  50));
  it("should get bonus for the 6th 10% tokens", () => checkBonus(0.5, 1000,  38));
  it("should get bonus for the 7th 10% tokens", () => checkBonus(0.6, 1000,  25));
  it("should get bonus for the 8th 10% tokens", () => checkBonus(0.7, 1000,  13));
  it("should not get bonus for the 9th 10% tokens", () => checkBonus(0.8, 1000,  0));

  const borderPass = tokensForSale.div(10);
  const crossBorderBonus = borderPass.mul(3/10).mul(0.15).add(borderPass.mul(7/10).mul(0.125));
  it("should get cross border bonus",
    () => checkBonus(0.07, borderPass, crossBorderBonus));

  // Total
  const checkTotal = (value, total) =>
    ico.getTotal.call(value)
      .then(res => assert.equal(total.toFixed(), res.toFixed()));

  it("should get total for 1 Wei", () => checkTotal(1, 287));
  const bigFund = new web3.BigNumber("1e18").mul(30000);
  const bigTotal = new web3.BigNumber("1e18").mul(8587500);
  it("should get total for 30000 Ether", () => checkTotal(bigFund, bigTotal));

  // Bonus after presale
  const presaleFund = new web3.BigNumber("1e18").mul(39000);
  it("should get total for 1 Wei after presale", () =>
    ico.mintForEarlyInvestors([team], [presaleFund])
      .then(() => checkTotal(1, 287)));

  const presaleSold = new web3.BigNumber("1e24").mul(15);
  it("should get presale total", () =>
    ico.getPresaleTotal(presaleFund)
      .then(sold => assert.equal(presaleSold.toFixed(), sold.toFixed())));

  const mainSale = tokensForSale.sub(presaleSold);
  const checkBonusAP = (sold, value, bonus) =>
    ico.getBonus.call(value, mainSale.mul(sold).toFixed())
      .then(res => assert.equal(bonus.toFixed(), res.toFixed()));

  it("should get bonus for the 1st 10% tokens after presale", () => checkBonusAP(0, 1000, 150));
  it("should get bonus for the 2nd 10% tokens after presale", () => checkBonusAP(0.1, 1000, 125));
  it("should get bonus for the 3rd 10% tokens after presale", () => checkBonusAP(0.2, 1000, 100));
  it("should get bonus for the 4th 10% tokens after presale", () => checkBonusAP(0.3, 1000,  75));
  it("should get bonus for the 5th 10% tokens after presale", () => checkBonusAP(0.4, 1000,  50));
  it("should get bonus for the 6th 10% tokens after presale", () => checkBonusAP(0.5, 1000,  38));
  it("should get bonus for the 7th 10% tokens after presale", () => checkBonusAP(0.6, 1000,  25));
  it("should get bonus for the 8th 10% tokens after presale", () => checkBonusAP(0.7, 1000,  13));
  it("should not get bonus for the 9th 10% tokens after presale", () => checkBonusAP(0.8, 1000,  0));
})
