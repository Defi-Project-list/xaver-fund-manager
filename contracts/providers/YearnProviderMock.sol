// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IYUSDC {
  function deposit(uint256 _amount) external;
  function withdraw(uint256 _amount) external;
  function balanceOf(address _address) external view returns(uint);
  function pricePerShare() external view returns(uint);
}

contract YearnProviderMock {
  address payable public owner;
  IERC20 public usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
  IYUSDC public yUsdc = IYUSDC(0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9);
  uint256 public constant SCALE = 1e6;

  constructor() {
    owner = _msgSender();
  }

  function deposit(uint256 amount) external {
    usdc.transferFrom(_msgSender(), address(this), amount);
    // TESTING =>
    // uint balanceTest = usdc.balanceOf(address(this));
    // console.log("USDC balance contract %s", balanceTest);
    _deposit(amount);
  }

  function withdraw(uint amount, address recipient) external {
    require(msg.sender == owner, "only owner");
    uint balanceShares = yUsdc.balanceOf(address(this));
    yUsdc.withdraw(balanceShares);
    
    usdc.transfer(recipient, amount);
    uint balanceUsdc = usdc.balanceOf(address(this));

    if(balanceUsdc > 0) {
      _deposit(balanceUsdc);
    }
  }

  function _deposit(uint256 amount) internal {
    usdc.approve(address(yUsdc), amount);
    yUsdc.deposit(amount);
  }

  //
  function balance() external view returns(uint256) {
    uint256 price = yUsdc.pricePerShare();
    console.log("price per share %s", price);
    uint256 balanceShares = yUsdc.balanceOf(address(this));
    console.log("Number of shares in contract %s", balanceShares);
    return (balanceShares * price) / SCALE;
  }

  function _msgSender() internal view virtual returns (address payable) {
        return payable(msg.sender); 
    }
}