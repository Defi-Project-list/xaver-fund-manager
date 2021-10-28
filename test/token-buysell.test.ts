import { expect } from "chai";
import { Signer, Wallet } from "ethers"
import { ethers, waffle } from "hardhat";

import SmartYieldArtifact from '../artifacts/contracts/SmartYield.sol/SmartYield.json';
import { SmartYield } from '@typechain/SmartYield';

import { getUSDCSigner, parseUnits, erc20, formatUnits } from './helpers/helpers';

const bb_cUSDC = '0x4B8d90D68F26DEF303Dcb6CFc9b63A1aAEC15840'
const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const compoundUSDCProvider = '0xDAA037F99d168b552c0c61B7Fb64cF7819D78310'

describe("Buy variable tokens", async () => {
  let Smartyield : any, smartYield : any, owner : any, addr1 : object, addr2 : object, USDCSigner : any, erc20USDC : any

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    USDCSigner = await getUSDCSigner();
    erc20USDC = await erc20(usdc);

    smartYield = new ethers.Contract(bb_cUSDC, SmartYieldArtifact.abi, waffle.provider);
  });

  it("Should buy tokens and receive LP tokens / Sell and withdraw USDC", async () => {
    // SEND USDC to owner for spending
    const amount = parseUnits('2000.0', 6);
    const minTokens = 0;
    const deadline = 1636155524;
    await erc20USDC.connect(USDCSigner).transfer(owner.address, amount);

    // the provider calls the TransferFrom => approve Provider
    await erc20USDC.connect(owner).approve(compoundUSDCProvider, amount);

    // Buy tokens with owner account
    const buy = await smartYield.connect(owner).buyTokens(amount, minTokens, deadline);
    const USDCBalance = await erc20USDC.balanceOf(owner.address);
    const tokenBalance = await smartYield.balanceOf(owner.address);
    console.log(`LP token balance: ${(formatUnits(tokenBalance, 6))}`);

    expect(Number(tokenBalance)).to.be.greaterThan(0)
    expect(USDCBalance).to.equal(0);

    // Sell tokens and withdraw USDC
    const sell = await smartYield.connect(owner).sellTokens(tokenBalance, minTokens, deadline)
    const USDCBalanceAfter = await erc20USDC.balanceOf(owner.address);
    const tokenBalanceAfter = await smartYield.balanceOf(owner.address);
    console.log(`USDC Balance after sell: ${USDCBalanceAfter}`)
    console.log(`Token Balance after sell: ${tokenBalanceAfter}`)

    expect(tokenBalanceAfter).to.equal(0);
    expect(Number(USDCBalanceAfter)).to.be.greaterThan(0);
  });
});


// const daiBalance = await erc20USDC.balanceOf(owner.address)
// console.log(formatEther(daiBalance))
