import { expect } from "chai";
import { Wallet } from "ethers"
import { ethers, waffle } from "hardhat";

import SmartYieldArtifact from '../artifacts/contracts/SmartYield.sol/SmartYield.json';
import { SmartYield } from '../typechain';

import { getUSDCSigner, parseUnits, erc20, formatUnits } from './helpers';

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

  it("Should buy tokens and receive LP tokens", async () => {
    // SEND USDC to owner for spending
    const amount = parseUnits('2000.0', 6);
    await erc20USDC.connect(USDCSigner).transfer(owner.address, amount);

    // the provider calls the TransferFrom => approve
    await erc20USDC.connect(owner).approve(compoundUSDCProvider, amount)

    const tx = await smartYield.connect(owner).buyTokens(amount, 0, 1636155524)
    const tokenBalance = await smartYield.balanceOf(owner.address)
    console.log(`token balance: ${formatUnits(tokenBalance, 6)}`)

    // expect(tokenBalance).to.be.greaterThan(0)
  });
});


// const daiBalance = await erc20USDC.balanceOf(owner.address)
// console.log(formatEther(daiBalance))
