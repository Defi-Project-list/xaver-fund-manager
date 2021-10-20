// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IYDAI {
  function deposit(uint _amount) external;
  function withdraw(uint _amount) external;
  function balanceOf(address _address) external view returns(uint);
  function getPricePerFullShare() external view returns(uint);
}

contract YearnSupply {
  address payable public owner;
  IERC20 public dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
  IYDAI public yDai = IYDAI(0xC2cB1040220768554cf699b0d863A3cd4324ce32);

  constructor() {
    owner = _msgSender();
  }

  function supply(uint amount) external {
    dai.transferFrom(_msgSender(), address(this), amount);

    // TESTING =>
    uint balanceTest = dai.balanceOf(address(this));
    console.log("DAI balance contract %s", balanceTest);
    
    _supply(amount);
  }

  function withdraw(uint amount, address recipient) external {
    require(msg.sender == owner, "only owner");
    uint balanceShares = yDai.balanceOf(address(this));
    yDai.withdraw(balanceShares);
    dai.transfer(recipient, amount);
    uint balanceDai = dai.balanceOf(address(this));

    if(balanceDai > 0) {
      _supply(balanceDai);
    }
  }

  function _supply(uint amount) internal {
    dai.approve(address(yDai), amount);
    yDai.deposit(amount);
  }

  function balance() external view returns(uint) {
    uint price = yDai.getPricePerFullShare();
    uint balanceShares = yDai.balanceOf(address(this));
    return balanceShares * price;
  }

  function _msgSender() internal view virtual returns (address payable) {
        return payable(msg.sender); // added payable
    }
}