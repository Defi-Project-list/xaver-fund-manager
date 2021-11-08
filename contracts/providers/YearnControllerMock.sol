// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./../IController.sol";
import "./IYearnCumulator.sol";
import "./../oracle/IYieldOracle.sol";
import "./../oracle/IYieldOraclelizable.sol";

interface IYUSDC {
    function deposit(uint256 _amount) external;

    function withdraw(uint256 _amount) external;

    function balanceOf(address _address) external view returns (uint256);

    function pricePerShare() external view returns (uint256);
}

contract YearnControllerMock is IController, IYearnCumulator, IYieldOraclelizable {
    using SafeMath for uint256;

    // last time we cumulated
    uint256 public prevCumulationTime;

    // exchnageRateStored last time we cumulated
    uint256 public prevExchnageRateCurrent;

    // cumulative supply rate += ((new underlying) / underlying)
    uint256 public cumulativeSupplyRate;

    // claim token (ie. yDAI)
    address public yToken;

    constructor(
      address pool_,
      address bondModel_,
      address yToken_
    )
      IController()
    {
      pool = pool_;
      // 30% per year linear
      setBondMaxRatePerDay(821917808219178);
      setBondModel(bondModel_);
      yToken = yToken_;
    }
    
    function providerRatePerDay() public override virtual returns (uint256) {
      return IYieldOracle(oracle).consult(1 days);
    }

    function _beforeCTokenBalanceChange()
      external override
      // onlyPool
    { }

    function _afterCTokenBalanceChange()
      external override
      // onlyPool
    {
      updateCumulativesInternal();
      IYieldOracle(oracle).update();
    }

    function cumulatives()
      external override
      returns (uint256)
    {
      uint256 timeElapsed = block.timestamp - prevCumulationTime;

      // only cumulate once per block
      if (0 == timeElapsed) {
        return cumulativeSupplyRate;
      }

      updateCumulativesInternal();

      return cumulativeSupplyRate;
    }

    function updateCumulativesInternal()
      private
    {
      uint256 timeElapsed = block.timestamp - prevCumulationTime;

      if (0 == timeElapsed) {
        return;
      }

      uint256 exchangeRateStoredNow = IYUSDC(yToken).pricePerShare();

      if (prevExchnageRateCurrent > 0) {
        cumulativeSupplyRate += exchangeRateStoredNow.sub(prevExchnageRateCurrent).mul(EXP_SCALE).div(prevExchnageRateCurrent);
      }

      prevCumulationTime = block.timestamp;

      prevExchnageRateCurrent = exchangeRateStoredNow;
    }
}