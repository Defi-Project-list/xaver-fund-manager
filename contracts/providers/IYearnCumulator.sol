// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.7.6;

interface IYearnCumulator {
  function _beforeCTokenBalanceChange() external;

  function _afterCTokenBalanceChange() external;
}