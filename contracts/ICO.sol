
pragma solidity ^0.4.11;

import "./PKT.sol";
import "./installed/token/ERC20.sol";


contract ICO {

  // Constants
  // =========

  uint256 public constant tokensPerEth = 250; // PKT per ETH
  uint256 public constant tokenLimit = 100 * 1e6 * 1e18;
  uint256 public constant tokensForSale = tokenLimit * 60 / 100;
  uint256 private tokensSold = 0;
  uint256 private presaleSold = 0;


  // Events
  // ======

  event RunIco();
  event PauseIco();
  event FinishIco(address team, address foundation, address advisors, address bounty);


  // State variables
  // ===============

  PKT public pkt;

  address public team;
  modifier teamOnly { require(msg.sender == team); _; }

  enum IcoState { Created, Running, Paused, Finished }
  IcoState private icoState = IcoState.Created;


  // Constructor
  // ===========

  function ICO(address _team) {
    team = _team;
    pkt = new PKT(this, tokenLimit);
  }


  // Public functions
  // ================

  // Here you can buy some tokens (just don't forget to provide enough gas).
  function() external payable {
    buyFor(msg.sender);
  }


  function buyFor(address _investor) public payable {
    require(icoState == IcoState.Running);
    require(msg.value > 0);
    buy(_investor, msg.value);
  }


  function getTokensSold() public constant returns (uint256) {
    return tokensSold;
  }


  function getPresaleTotal(uint256 _value) public constant returns (uint256) {
    uint256 _pktValue = _value * tokensPerEth;
    uint256 _bonus = getPresaleBonus(_value);
    return _pktValue + _bonus;
  }


  function getPresaleBonus(uint256 _value) public constant returns (uint256) {
    if(_value < 60 ether) {
      return calcPresaleBonus(_value, 20);
    }

	  if(_value >= 60 ether && _value < 150 ether) {
      return calcPresaleDiscount(_value, 25);
    }

    if(_value >= 150 ether && _value < 500 ether) {
      return calcPresaleDiscount(_value, 30);
    }

    if(_value >= 500 ether) {
      return calcPresaleDiscount(_value, 35);
    }
  }


  function getTotal(uint256 _value) public constant returns (uint256) {
    uint256 _pktValue = _value * tokensPerEth;
    uint256 _bonus = getBonus(_pktValue, tokensSold);
    return _pktValue + _bonus;
  }


  function getBonus(uint256 _pktValue, uint256 _sold) public constant returns (uint256) {
    uint256[8] memory _bonusPattern = [ uint256(150), 125, 100, 75, 50, 38, 25, 13 ];
    uint256 _step = (tokensForSale - presaleSold) / 10;
    uint256 _bonus = 0;

    for(uint8 i = 0; i < _bonusPattern.length; ++i) {
      uint256 _min = _step * i;
      uint256 _max = _step * (i + 1);
      if(_sold >= _min && _sold < _max) {
        uint256 _bonusPart = min(_pktValue, _max - _sold);
        _bonus += _bonusPart * _bonusPattern[i] / 1000;
        _pktValue -= _bonusPart;
        _sold  += _bonusPart;
      }
    }

    return _bonus;
  }


  // Priveleged functions
  // ====================

  function mintForEarlyInvestors(address[] _investors, uint256[] _values) external teamOnly {
    require(_investors.length == _values.length);
    for (uint256 i = 0; i < _investors.length; ++i) {
      mintPresaleTokens(_investors[i], _values[i]);
    }
  }


  function withdrawEther(uint256 _value) external teamOnly {
    team.transfer(_value);
  }


  // Save tokens from contract
  function withdrawToken(address _tokenContract, uint256 _value) external teamOnly {
    ERC20 _token = ERC20(_tokenContract);
    _token.transfer(team, _value);
  }


  function withdrawTokenFromPkt(address _tokenContract, uint256 _value) external teamOnly {
    pkt.withdrawToken(_tokenContract, team, _value);
  }


  // ICO state management: start / pause / finish
  // --------------------------------------------

  function startIco() external teamOnly {
    require(icoState == IcoState.Created || icoState == IcoState.Paused);
    icoState = IcoState.Running;
    RunIco();
  }


  function pauseIco() external teamOnly {
    require(icoState == IcoState.Running);
    icoState = IcoState.Paused;
    PauseIco();
  }


  function finishIco(address _team, address _foundation, address _advisors, address _bounty) external teamOnly {
    require(icoState == IcoState.Running || icoState == IcoState.Paused);

    icoState = IcoState.Finished;

    pkt.mint(_team, tokenLimit * 200 / 1000);
    pkt.mint(_foundation, tokenLimit * 125 / 1000);
    pkt.mint(_advisors, tokenLimit * 60 / 1000);
    pkt.mint(_bounty, tokenLimit * 15 / 1000);

    pkt.defrost();

    FinishIco(_team, _foundation, _advisors, _bounty);
  }


  // Private functions
  // =================

  function mintPresaleTokens(address _investor, uint256 _value) internal {
    require(icoState == IcoState.Created);
    require(_value > 0);

    uint256 _pktValue = getPresaleTotal(_value);

    require(tokensSold + _pktValue <= tokensForSale);

    pkt.mint(_investor, _pktValue);
    tokensSold += _pktValue;
    presaleSold += _pktValue;
  }


  function calcPresaleBonus(uint256 _value, uint256 _percent) internal constant returns (uint256) {
    return _value * _percent * tokensPerEth / 100;
  }


  function calcPresaleDiscount(uint256 _value, uint256 _percent) internal constant returns (uint256) {
    return _value * tokensPerEth * 100 / (100 - _percent) - _value * tokensPerEth;
  }


  function min(uint256 a, uint256 b) internal constant returns (uint256) {
    return a < b ? a : b;
  }


  function buy(address _investor, uint256 _value) internal {
    uint256 _total = getTotal(_value);

    require(tokensSold + _total <= tokensForSale);

    pkt.mint(_investor, _total);
    tokensSold += _total;
  }
}
