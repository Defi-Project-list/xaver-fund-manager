require('@ethereum-waffle/compiler');
const { ethers, network, waffle } = require("hardhat");
const erc20ABI = require('../abis/erc20.json');
const cTokenABI = require('../abis/cToken.json');
const provider = waffle.provider;


const DAIWhale = "0xE78388b4CE79068e89Bf8aA7f218eF6b9AB0e9d0"
const USDCWhale = '0x55FE002aefF02F77364de339a1292923A15844B8'

exports.getDAISigner = async () => {
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [DAIWhale],
  });
  return ethers.provider.getSigner(DAIWhale);
}

exports.getUSDCSigner = async () => {
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDCWhale],
  });
  return ethers.provider.getSigner(USDCWhale);
}

exports.erc20 = async (tokenAddress) => {
  return new ethers.Contract(tokenAddress, erc20ABI, provider);
}

exports.cToken = async (tokenAddress) => {
  return new ethers.Contract(tokenAddress, cTokenABI, provider);
}

exports.parseEther = (amount) => ethers.utils.parseEther(amount)
exports.formatEther = (amount) => ethers.utils.formatEther(amount)
exports.parseUnits = (amount, number) => ethers.utils.parseUnits(amount, number)
exports.formatUnits = (amount, number) => ethers.utils.formatUnits(amount, number)

