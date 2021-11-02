import { expect } from "chai";
import { Signer, Wallet, BigNumber } from "ethers"
import { ethers, waffle } from "hardhat";

import { deployBondModel, deployCompoundProvider, deploySmartYield, deploySeniorBond, deployJuniorBond, deployCompoundController, deployYieldOracle } from "./helpers/deploy";

const seniorBondCONF = { name: 'Tester cUSDC sBOND', symbol: 'TVaUSDC' };
const juniorBondCONF = { name: 'Tester cUSDC jBOND', symbol: 'TFiUSDC' };
const juniorTokenCONF = { name: 'Tester cUSDC', symbol: 'TTokUSDC' };

const A_HOUR = 60 * 60;
const oracleCONF = { windowSize: A_HOUR, granularity: 4 };

// mainnet addresses
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const compoundUSDCProvider = '0xDAA037F99d168b552c0c61B7Fb64cF7819D78310';
const COMP = '0xc00e94cb662c3520282e6f5717214004a7f26888';
const cUSDC = '0x39aa39c021dfbae8fac545936693ac917d5e7563';
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const dao = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // DUMMIEEEEE

const uniswapPath = [COMP, WETH, USDC];

const decimals = 6; 

describe("Deploying contracts", async () => {
  let owner : any, addr1 : object, addr2 : object

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const bondModel = await deployBondModel(owner);
    const pool = await deployCompoundProvider(owner, cUSDC);

    const smartYield = await deploySmartYield(owner, juniorTokenCONF.name, juniorTokenCONF.symbol, BigNumber.from(decimals));
    const seniorBond = await deploySeniorBond(owner, smartYield.address, seniorBondCONF.name, seniorBondCONF.symbol);
    const juniorBond = await deployJuniorBond(owner, smartYield.address, juniorBondCONF.name, juniorBondCONF.symbol);

    const controller = await deployCompoundController(owner, pool.address, smartYield.address, bondModel.address, uniswapPath);
    const oracle = await deployYieldOracle(owner, controller.address, oracleCONF.windowSize, oracleCONF.granularity);

    await controller.setOracle(oracle.address);
    await controller.setFeesOwner(dao);
    await smartYield.setup(controller.address, pool.address, seniorBond.address, juniorBond.address);
    await pool.setup(smartYield.address, controller.address);

    await controller.setGuardian(dao);
    await controller.setDao(dao);
  
    console.log(bondModel.address)
    console.log(pool.address)
    console.log(smartYield.address)
    console.log(seniorBond.address)
    console.log(juniorBond.address)
    console.log(controller.address)
    console.log(oracle.address)
  });

  it("Should deploy contracts", async () => {


  });
});
