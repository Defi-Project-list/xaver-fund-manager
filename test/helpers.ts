require('@ethereum-waffle/compiler');
const { ethers, network, waffle } = require("hardhat");
const erc20ABI = require('../abis/erc20.json');
const cTokenABI = require('../abis/cToken.json');
const provider = waffle.provider;


const DAIWhale = "0xE78388b4CE79068e89Bf8aA7f218eF6b9AB0e9d0"
const USDCWhale = '0x55FE002aefF02F77364de339a1292923A15844B8'

export const getDAISigner = async () => {
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [DAIWhale],
  });
  return ethers.provider.getSigner(DAIWhale);
}

export const getUSDCSigner = async () => {
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDCWhale],
  });
  return ethers.provider.getSigner(USDCWhale);
}

export const erc20 = async (tokenAddress : string) => {
  return new ethers.Contract(tokenAddress, erc20ABI, provider);
}

export const cToken = async (tokenAddress : string) => {
  return new ethers.Contract(tokenAddress, cTokenABI, provider);
}

export const parseEther = (amount : string) => ethers.utils.parseEther(amount)
export const formatEther = (amount : string) => ethers.utils.formatEther(amount)
export const parseUnits = (amount : string, number : number) => ethers.utils.parseUnits(amount, number)
export const formatUnits = (amount : string, number : number) => ethers.utils.formatUnits(amount, number)
