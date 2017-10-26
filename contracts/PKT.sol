pragma solidity ^0.4.15;

import "./installed/token/StandardToken.sol";

contract PKT is StandardToken {

  // Constants
  // =========

  string public constant name = "Playkey Token";
  string public constant symbol = "PKT";
  uint8 public constant decimals = 18;
  uint256 public tokenLimit;


  // State variables
  // ===============

  address public ico;
  modifier icoOnly { require(msg.sender == ico); _; }

  // Tokens are frozen until ICO ends.
  bool public tokensAreFrozen = true;


  // Constructor
  // ===========

  function PKT(address _ico, uint256 _tokenLimit) {
    ico = _ico;
    tokenLimit = _tokenLimit;
  }


  // Priveleged functions
  // ====================

  // Mint few tokens and transfer them to some address.
  function mint(address _holder, uint256 _value) external icoOnly {
    require(_holder != address(0));
    require(_value != 0);
    require(totalSupply + _value <= tokenLimit);

    balances[_holder] += _value;
    totalSupply += _value;
    Transfer(0x0, _holder, _value);
  }


  // Allow token transfer.
  function defrost() external icoOnly {
    tokensAreFrozen = false;
  }


  // Save tokens from contract
  function withdrawToken(address _tokenContract, address where, uint256 _value) external icoOnly {
    ERC20 _token = ERC20(_tokenContract);
    _token.transfer(where, _value);
  }


  // ERC20 functions
  // =========================

  function transfer(address _to, uint256 _value)  public returns (bool) {
    require(!tokensAreFrozen);
    return super.transfer(_to, _value);
  }


  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(!tokensAreFrozen);
    return super.transferFrom(_from, _to, _value);
  }


  function approve(address _spender, uint256 _value) public returns (bool) {
    require(!tokensAreFrozen);
    return super.approve(_spender, _value);
  }
}
