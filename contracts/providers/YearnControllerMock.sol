// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


import "./../IController.sol";
import "./IYearnCumulator.sol";
import "./../oracle/IYieldOracle.sol";
import "./../oracle/IYieldOraclelizable.sol";

contract YearnControllerMock is IController, IYearnCumulator, IYieldOraclelizable {
    constructor(
      address pool_,
      address bondModel_
    )
      IController()
    {
      pool = pool_;
      // 30% per year linear
      setBondMaxRatePerDay(821917808219178);
      setBondModel(bondModel_);
    }
    function providerRatePerDay() public returns (uint256) {
      return IYieldOracle(oracle).consult(1 days);
    //   return MathUtils.min(
    //     MathUtils.min(BOND_MAX_RATE_PER_DAY, spotDailyRate()),
    //     IYieldOracle(oracle).consult(1 days)
    //   );
    }
}