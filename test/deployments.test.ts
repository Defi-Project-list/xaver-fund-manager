import { expect } from "chai";
import { Signer, Wallet } from "ethers"
import { ethers, waffle } from "hardhat";

import { deployBondModel, deployCompoundProvider } from "./helpers/deploy";

const seniorBondCONF = { name: 'Tester cUSDC sBOND', symbol: 'TVaUSDC' };
const juniorBondCONF = { name: 'Tester cUSDC jBOND', symbol: 'TFiUSDC' };
const juniorTokenCONF = { name: 'Tester cUSDC', symbol: 'TTokUSDC' };

const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const compoundUSDCProvider = '0xDAA037F99d168b552c0c61B7Fb64cF7819D78310'
const cUSDC = '0x39aa39c021dfbae8fac545936693ac917d5e7563'

describe("Deploying contracts", async () => {
  let Smartyield : any, smartYield : any, owner : any, addr1 : object, addr2 : object

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const bondModel = await deployBondModel(owner);
    const pool = await deployCompoundProvider(owner, cUSDC);

    console.log(bondModel.address)
    console.log(pool.address)
  });

  it("Should deploy contracts", async () => {


  });
});
