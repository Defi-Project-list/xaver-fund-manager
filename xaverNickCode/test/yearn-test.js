require('@ethereum-waffle/compiler');
const { expect } = require("chai");
const { ethers, network, waffle } = require("hardhat");
const { getDAISigner, erc20, parseEther, formatEther, formatUnits, parseUnits } = require('./NickHelpers.js');

const dai = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

describe("Deploy Contract and interact with Yearn", async () => {

  beforeEach(async () => {
    YearnSupply = await ethers.getContractFactory('YearnSupply');
    yearnSupply = await YearnSupply.deploy();

    DAISigner = await getDAISigner();
    erc20DAI = await erc20(dai);

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Should supply and withdraw tokens from Yearn", async () => {
    const amountDAI = parseEther('1000.0');
    await erc20DAI.connect(DAISigner).transfer(addr1.address, amountDAI);

    await erc20DAI.connect(addr1).approve(yearnSupply.address, amountDAI)

    await yearnSupply.connect(addr1).supply(amountDAI);

  });
});
