import { expect } from "chai";
import { Signer, Wallet } from "ethers"
import { ethers, waffle } from "hardhat";
const { time } = require('@openzeppelin/test-helpers');

import { deployYearnProvider} from "./helpers/deploy";

import { getUSDCSigner, erc20, formatUSDC, parseUSDC } from './helpers/helpers';

const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const yusdc = '0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9'

describe("Deploy Contract and interact with Yearn", async () => {
  let yearnProvider: any, owner: any, addr1: any, USDCSigner: any, erc20USDC: any

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    yearnProvider = await deployYearnProvider(owner, yusdc, usdc);
    await yearnProvider.setup(addr1.address, addr1.address)

    USDCSigner = await getUSDCSigner();
    erc20USDC = await erc20(usdc);

    console.log(yearnProvider.address)
  });

  it("Should deposit and withdraw tokens from Yearn", async () => {
    const amountUSDC = parseUSDC('1000000.0'); // 1m
    const fee = 0
    await erc20USDC.connect(USDCSigner).transfer(addr1.address, amountUSDC);
    await erc20USDC.connect(addr1).approve(yearnProvider.address, amountUSDC)

    console.log(`-------------------------Deposit----------------------`)  
    await yearnProvider.connect(addr1)._takeUnderlying(addr1.address, amountUSDC);
    await yearnProvider.connect(addr1)._depositProvider(amountUSDC, fee);

    const balance = await yearnProvider.balance();
    console.log(`token balance contract ${formatUSDC(balance)}`)
  });
});