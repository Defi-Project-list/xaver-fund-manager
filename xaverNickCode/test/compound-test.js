require('@ethereum-waffle/compiler');
const { expect } = require("chai");
const { ethers, network, waffle } = require("hardhat");
const { getDAISigner, getUSDCSigner, erc20, cToken, parseEther, formatEther, formatUnits, parseUnits } = require('./NickHelpers.js');

const dai = '0x6b175474e89094c44da98b954eedeac495271d0f'
const usdc = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const cDAI = '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643';

describe("Deploy contract and interact with Compound", async () => {
  beforeEach(async () => {
    CompoundSupply = await ethers.getContractFactory('CompoundSupply');
    compoundSupply = await CompoundSupply.deploy();

    DAISigner = await getDAISigner();
    USDCSigner = await getUSDCSigner();
    erc20DAI = await erc20(dai);
    erc20USDC = await erc20(usdc);
    cTokenContract = await cToken(cDAI);

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Impersonate Account and send USDC and DAI to addr1", async () => {
    const amountDAI = parseEther('200.0');
    const amountUSDC = parseUnits('5000.0', 6);

    await erc20DAI.connect(DAISigner).transfer(addr1.address, amountDAI);
    const balanceDAI = await erc20DAI.balanceOf(addr1.address);

    await erc20USDC.connect(USDCSigner).transfer(addr1.address, amountUSDC);
    const balanceUSDC = await erc20USDC.balanceOf(addr1.address);

    expect(balanceDAI).to.equal(amountDAI);
    expect(balanceUSDC).to.equal(amountUSDC);
  });

  it("Should supply and withdraw tokens from Compound", async () => {
    const amountDAI = parseEther('1000.0');
    await erc20DAI.connect(DAISigner).transfer(addr1.address, amountDAI);

    // Supplying
    tx = await erc20DAI.connect(addr1).transfer(
      compoundSupply.address,
      amountDAI
    );
    await tx.wait(1);

    tx = await compoundSupply.supplyErc20ToCompound(dai, cDAI, amountDAI);
    await tx.wait(1);

    const cTokenBalance = await cTokenContract.balanceOf(compoundSupply.address)
    console.log(`cToken Balance in contract ${formatUnits(cTokenBalance, 8)}`)

    //Withdraw
    tx = await compoundSupply.redeemCErc20Tokens(cTokenBalance, true, cDAI);
    receipt = await tx.wait(1);

    // console.log(receipt)
    const cTokenBalanceAfter = await cTokenContract.balanceOf(compoundSupply.address)

    expect(cTokenBalanceAfter).to.equal(0)
  });
});
