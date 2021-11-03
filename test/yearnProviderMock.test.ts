import { expect } from "chai";
import { Signer, Wallet } from "ethers"
import { ethers, waffle } from "hardhat";
const { time } = require('@openzeppelin/test-helpers');

import { deployYearnProviderMock} from "./helpers/deploy";

import { getUSDCSigner, erc20, formatUSDC, parseUSDC } from './helpers/helpers';

const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

describe("Deploy Contract and interact with Yearn", async () => {
  let yearnProviderMock : any, owner : any, USDCSigner : any, erc20USDC : any

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    yearnProviderMock = await deployYearnProviderMock(owner);

    USDCSigner = await getUSDCSigner();
    erc20USDC = await erc20(usdc);
  });

  it("Should deposit and withdraw tokens from Yearn", async () => {
    const amountUSDC = parseUSDC('1000000.0'); // 1m
    await erc20USDC.connect(USDCSigner).transfer(owner.address, amountUSDC);
    await erc20USDC.connect(owner).approve(yearnProviderMock.address, amountUSDC)

    console.log(`-------------------------Deposit----------------------`)  
    await yearnProviderMock.connect(owner).deposit(amountUSDC);

    const balance1 = await yearnProviderMock.balance();
    console.log(`token balance contract ${formatUSDC(balance1)}`)

    console.log(await time.latestBlock())
    await time.advanceBlockTo(12526800)
    console.log(await time.latestBlock())

    console.log(`-------------------------Withdraw----------------------`)    
    await yearnProviderMock.connect(owner).withdraw(balance1, owner.address);

    const balance2 = await yearnProviderMock.balance();
    console.log(`token balance contract ${formatUSDC(balance2)}`)

    const USDCBalance = await erc20USDC.balanceOf(owner.address);
    console.log(`USDC balance ${formatUSDC(USDCBalance)}`)
  });
});
