pragma solidity ^0.7.6;
pragma abicoder v2;

interface IYearnVault {
  function deposit(uint256 _amount) external;
  function withdraw(uint256 _amount) external;
  function balanceOf(address _address) external view returns(uint);
  function pricePerShare() external view returns(uint);
}