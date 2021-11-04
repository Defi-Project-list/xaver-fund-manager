import { expect } from "chai";
import { Signer, Wallet } from "ethers"
import { ethers, waffle } from "hardhat";
const { time } = require('@openzeppelin/test-helpers');

import { deployYieldOracle, deployBondModel, deployYearnControllerMock, deployYearnProviderMock} from "./helpers/deploy";

const A_HOUR = 60 * 60;
const oracleCONF = { windowSize: A_HOUR, granularity: 4 };

import { getUSDCSigner, erc20, formatUSDC, parseUSDC } from './helpers/helpers';

const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const dao = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // DUMMIEEEEE

describe("Deploying contract and interact with Yearn", async () => {
    let owner : any, addr1 : object, addr2 : object
  
    beforeEach(async () => {
      [owner, addr1, addr2] = await ethers.getSigners();
  
      const bondModel = await deployBondModel(owner);
      const pool = await deployYearnProviderMock(owner);
  
      const controller = await deployYearnControllerMock(owner, pool.address, bondModel.address);
      const oracle = await deployYieldOracle(owner, controller.address, oracleCONF.windowSize, oracleCONF.granularity);
  
      await controller.setOracle(oracle.address);
      await controller.setFeesOwner(dao);
  
      await controller.setGuardian(dao);
      await controller.setDao(dao);
    
      console.log(bondModel.address)
      console.log(pool.address)
      console.log(controller.address)
      console.log(oracle.address)
    });

    it("Should deploy contracts", async () => {

    });
});