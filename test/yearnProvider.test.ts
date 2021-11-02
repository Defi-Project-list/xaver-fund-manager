import { expect } from "chai";
import { Signer, Wallet } from "ethers"
import { ethers, waffle } from "hardhat";

import { deployYearnProviderMock} from "./helpers/deploy";

import { getUSDCSigner, erc20, formatUSDC, parseUSDC } from './helpers/helpers';

const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

const A_HOUR = 60 * 60;
const A_DAY = A_HOUR * 24;

const forceNextTime = async (timeElapsed = 1500): Promise<void> => {
  await ethers.provider.send('evm_increaseTime', [timeElapsed]);
};

const mineBlocks = async (blocks: number): Promise<void> => {
  const blockBefore = await ethers.provider.getBlock('latest');
  for (let i = 0; i < blocks; i++) {
    await ethers.provider.send('evm_mine', [blockBefore.timestamp + ((i + 1) * 15)]);
  }
};

describe("Deploy Contract and interact with Yearn", async () => {
  let yearnProviderMock : any, owner : any, addr1 : any, addr2 : any, USDCSigner : any, erc20USDC : any, decimals : number

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    yearnProviderMock = await deployYearnProviderMock(owner);

    USDCSigner = await getUSDCSigner();
    erc20USDC = await erc20(usdc);

    decimals = 6;
  });

  it("Should deposit and withdraw tokens from Yearn", async () => {
    const amountUSDC = parseUSDC('1000.0');
    await erc20USDC.connect(USDCSigner).transfer(owner.address, amountUSDC);
    await erc20USDC.connect(owner).approve(yearnProviderMock.address, amountUSDC)

    console.log(`-------------------------Deposit----------------------`)  
    await yearnProviderMock.connect(owner).deposit(amountUSDC);

    const balance1 = await yearnProviderMock.balance();
    console.log(`token balance contract ${formatUSDC(balance1)}`)

    console.log(`-------------------------Withdraw----------------------`)    
    await yearnProviderMock.connect(owner).withdraw(balance1, owner.address);

    const balance2 = await yearnProviderMock.balance();
    console.log(`token balance contract ${formatUSDC(balance2)}`)

    const USDCBalance = await erc20USDC.balanceOf(owner.address);
    console.log(`USDC balance ${formatUSDC(USDCBalance)}`)
  });
});
