const PKT = artifacts.require("./PKT.sol");
const ICO = artifacts.require("./PlaykeyICO.sol");

contract("limits", () => {

  const tokenLimit = new web3.BigNumber("1e18").mul(100000000);

  const [team] = web3.eth.accounts;
  let ico;
  let pkt;

  it("should be able to create ICO", () =>
    ICO.new(team).then(res => {
      assert.isOk(res && res.address, "has invalid address");
      ico = res;
      return ico.pkt.call().then(res => pkt = PKT.at(res));
    })
  );

  it("should be the same PKT address", () =>
    ico.pkt.call().then(address =>
      assert.equal(pkt.address, address)
    ));

  it("should be 60% of tokens for sale", () =>
    ico.tokensForSale.call().then(sale =>
      assert.equal(tokenLimit.mul(0.6).toFixed(), sale.toFixed())
    ));

  it("should be 250 tokens per 1 Ether", () =>
    ico.tokensPerEth.call().then(tpe =>
      assert.equal(250, tpe.toFixed())
    ));

  it("should be the same ICO address", () =>
    pkt.ico.call().then(address =>
      assert.equal(ico.address, address)
    ));

  it("should be 'Playkey Token' name", () =>
      pkt.name.call().then(name =>
        assert.equal("Playkey Token", name)
    ));

  it("should be 'PKT' symbol", () =>
      pkt.symbol.call().then(symbol =>
        assert.equal("PKT", symbol)
    ));

  it("should be 18 decimals", () =>
      pkt.decimals.call().then(decimals =>
        assert.equal(18, decimals.toFixed())
    ));

  it("should be " + tokenLimit.toFixed().toString() + " tokens total", () =>
      pkt.tokenLimit.call().then(pktLimit =>
        assert.equal(tokenLimit.toFixed(), pktLimit.toFixed())
    ));

  it("should be equal tokenLimit", () =>
    pkt.tokenLimit.call().then(pktLimit =>
      ico.tokenLimit.call().then(icoLimit =>
        assert.equal(pktLimit.toFixed(), icoLimit.toFixed())
    )));

  it("should be frozen tokens", () =>
      pkt.tokensAreFrozen.call().then(frozen =>
        assert.equal(true, frozen)
    ));
})
