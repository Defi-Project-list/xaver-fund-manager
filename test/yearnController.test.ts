import { expect } from "chai";
import { Signer, Wallet, BigNumber } from "ethers"
import { ethers, waffle } from "hardhat";

import { SmartYield } from '@typechain/SmartYield';
import { YieldOracle } from "@typechain/YieldOracle";
import { IYieldOracle } from "@typechain/IYieldOracle";

const { time } = require('@openzeppelin/test-helpers');

import { deployYieldOracle, deployYieldOracleInterface, deployBondModel, deployYearnControllerMock, deployYearnProviderMock, deploySmartYield } from "./helpers/deploy";

const A_HOUR = 60 * 60;
const A_DAY = A_HOUR * 24;
const oracleCONF = { windowSize: A_HOUR, granularity: 4 };
const juniorTokenCONF = { name: 'Tester cUSDC', symbol: 'TTokUSDC' };

import { getUSDCSigner, erc20, formatUSDC, parseUSDC } from './helpers/helpers';
import { Address } from "cluster";
import { Provider } from "web3/providers";

const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const dao = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // DUMMIEEEEE

const decimals = 6;

describe("Deploying contract and interact with Yearn", async () => {
    let owner : Signer, addr1 : Signer, addr2 : Signer;
    let smartYield: SmartYield;
    let oracle: YieldOracle;
    let oracleInterface: IYieldOracle;
  
    beforeEach(async () => {
      [owner, addr1, addr2] = await ethers.getSigners();
  
      const bondModel = await deployBondModel(owner);
      const pool = await deployYearnProviderMock(owner);

      smartYield = await deploySmartYield(owner, juniorTokenCONF.name, juniorTokenCONF.symbol, BigNumber.from(decimals));
      const controller = await deployYearnControllerMock(owner, pool.address, bondModel.address, usdc);
      oracle = await deployYieldOracle(owner, controller.address, oracleCONF.windowSize, oracleCONF.granularity);
      oracleInterface = await deployYieldOracleInterface(owner);
  
      await controller.setOracle(oracle.address);
      await controller.setFeesOwner(dao);
  
      await controller.setGuardian(dao);
      await controller.setDao(dao);
    
      console.log(bondModel.address)
      console.log(pool.address)
      console.log(controller.address)
      console.log(oracle.address)
      console.log(smartYield.address)
    });

    it("Should calculate a bondGain", async () => {
      const gain = await smartYield.bondGain(100, 30);
      expect(gain).to.be.greaterThan(0);
    });   

    it("Should be able to consult the Yield Oracle", async () => {
      await oracleInterface(oracle).consult(A_DAY);
    });  
    
    
});