const PKT = artifacts.require("./PKT.sol");
const ICO = artifacts.require("./PlaykeyICO.sol");

contract("presale bonus", () => {

  web3.BigNumber.config({ DECIMAL_PLACES: 30 });
  const ceil = web3.BigNumber.ROUND_HALF_CEIL;
  const ether = new web3.BigNumber("1e18");
  const pktPerWei = 250;

  const [team] = web3.eth.accounts;
  let ico;

  it("should be able to create ICO", () =>
    ICO.new(team).then(res => {
      assert.isOk(res && res.address, "has invalid address");
      ico = res;
    })
  );

  const checkTotal = (value, total) =>
    ico.getPresaleTotal.call(value)
      .then(res => {
        let t = total.round(0, ceil);
        assert(
          res.sub(t).abs() <= 1,
          "expected '" + t.toFixed().toString() +
          "' to equal '" + res.toFixed().toString() + "'"
      );});

  const calcBonus = (value, total) => {
    return total.sub(new web3.BigNumber(value).mul(pktPerWei))
  };

  // No discount
  {
    const pkt = new web3.BigNumber("1e18");
    it("should get total for 1 Wei", () => checkTotal(1, new web3.BigNumber(pktPerWei)));
    it("should get total for 1 Ether", () => checkTotal(ether, pkt.mul(pktPerWei)));
    it("should get total for 59.999999999999999999 Ether",
      () => checkTotal(ether.mul(60).sub(1), pkt.mul(60 * pktPerWei).sub(pktPerWei)));
  }

  // Discount
  const checkDiscount = (value, bonus) =>
    ico.getPresaleTotal.call(value)
      .then(total => calcBonus(value, total))
      .then(res => {
        let b = bonus.round(0, ceil);
        assert(
          res.sub(b).abs() <= 1,
          "expected '" + b.toFixed().toString() +
          "' to equal '" + res.toFixed().toString() + "'"
      );});

  const checkWrongDiscount = (value, bonus) =>
    ico.getPresaleTotal.call(value)
      .then(total => calcBonus(value, total))
      .then(res => {
        let b = bonus.round(0, ceil);
        assert(
          res.sub(b).abs() > 1,
          "expected '" + b.toFixed().toString() +
          "' to equal '" + res.toFixed().toString() + "'"
    );});

  // Discount 25%
  {
    const discount = new web3.BigNumber(0.75);
    const bonusPerWei = new web3.BigNumber("1").mul(pktPerWei).div(discount).sub(pktPerWei);
    const pkt = new web3.BigNumber("1e18").mul(bonusPerWei);

    it("should get discount for 60 Ether",
      () => checkDiscount(ether.mul(60), pkt.mul(60)));
    it("should get discount for 93.156298167150531567 Ether",
      () => checkDiscount(
        new web3.BigNumber("93156298167150531567"),
        new web3.BigNumber("93156298167150531567").mul(bonusPerWei)
      ));
    it("should get discount for 149.999999999999999999 Ether",
      () => checkDiscount(ether.mul(150).sub(1), pkt.mul(150).sub(bonusPerWei)));

    it("should get wrong discount for 59.999999999999999999 Ether",
      () => checkWrongDiscount(ether.mul(60).sub(1), pkt.mul(60).sub(bonusPerWei)));
    it("should get wrong discount for 150 Ether",
      () => checkWrongDiscount(ether.mul(150), pkt.mul(150)));

    it("should get total for 60 Ether",
     () => checkTotal(ether.mul(60), ether.mul(60).mul(pktPerWei).div(discount)));
  }

  // Discount 30%
  {
    const discount = new web3.BigNumber(0.7);
    const bonusPerWei = new web3.BigNumber("1").mul(pktPerWei).div(discount).sub(pktPerWei);
    const pkt = new web3.BigNumber("1e18").mul(bonusPerWei);

    it("should get discount for 150 Ether",
      () => checkDiscount(ether.mul(150), pkt.mul(150)));
    it("should get discount for 499.999999999999999999 Ether",
      () => checkDiscount(ether.mul(500).sub(1), pkt.mul(500).sub(bonusPerWei)));

    it("should get wrong discount for 149.999999999999999999 Ether",
      () => checkWrongDiscount(ether.mul(150).sub(1), pkt.mul(150).sub(bonusPerWei)));
    it("should get wrong discount for 500 Ether",
      () => checkWrongDiscount(ether.mul(500), pkt.mul(500)));

    it("should get total for 150 Ether",
     () => checkTotal(ether.mul(150), ether.mul(150).mul(pktPerWei).div(discount)));
  }

  // Discount 35%
  {
    const discount = new web3.BigNumber(0.65);
    const bonusPerWei = new web3.BigNumber("1").mul(pktPerWei).div(discount).sub(pktPerWei);
    const pkt = new web3.BigNumber("1e18").mul(bonusPerWei);

    it("should get discount for 500 Ether",
      () => checkDiscount(ether.mul(500), pkt.mul(500)));
    it("should get discount for 1234.567891011121314151 Ether",
      () => checkDiscount(
        new web3.BigNumber("1234567891011121314151"),
        new web3.BigNumber("1234567891011121314151").mul(bonusPerWei)
      ));
    it("should get discount for 12345 Ether",
      () => checkDiscount(ether.mul(12345), pkt.mul(12345)));
    it("should get discount for 123456 Ether",
      () => checkDiscount(ether.mul(123456), pkt.mul(123456)));

    it("should get wrong discount for 499.999999999999999999 Ether",
      () => checkWrongDiscount(ether.mul(500).sub(1), pkt.mul(500).sub(bonusPerWei)));

    it("should get total for 500 Ether",
     () => checkTotal(ether.mul(500), ether.mul(500).mul(pktPerWei).div(discount)));
  }
})
