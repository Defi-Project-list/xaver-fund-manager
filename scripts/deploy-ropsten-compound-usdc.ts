import 'tsconfig-paths/register';

import { deployBondModel, deployCompoundController, deployCompoundProvider, deployJuniorBond, deploySeniorBond, deploySmartYield, deployYieldOracle } from '../test/helpers/deploy';
import { Wallet, BigNumber as BN } from 'ethers';
import { run, ethers } from 'hardhat';

const A_HOUR = 60 * 60;

const seniorBondCONF = { name: 'Tester cUSDC sBOND', symbol: 'TVaUSDC' };
const juniorBondCONF = { name: 'Tester cUSDC jBOND', symbol: 'TFiUSDC' };
const juniorTokenCONF = { name: 'Tester cUSDC', symbol: 'TTokUSDC' };

const oracleCONF = { windowSize: A_HOUR, granularity: 4 };

// barnbridge
const decimals = 6; // same as USDC
const dao = '0xCA11d776673a8058DaFF6fbA16223120af8fF0B2';
const feesOwner = dao;

// compound ROPSTEN
const cUSDC = '0x2973e69b20563bcc66dc63bde153072c33ef37fe';
const COMP = '0xf76d4a441e4ba86a923ce32b89aff89dbccaa075';

const USDC = '0x07865c6e87b9f70255377e024ace6630c1eaa37f';
const WETH = '0xc778417e063141139fce010982780140aa0cd5ab';
const uniswapPath = [COMP, WETH, USDC];

async function main() {

  const [deployerSign, ...signers] = (await ethers.getSigners()) as unknown[] as Wallet[];

  console.log('Deployer:', deployerSign.address);
  console.log('Others:', signers.map(a => a.address));

  const bondModel = await deployBondModel(deployerSign);
  const pool = await deployCompoundProvider(deployerSign, cUSDC);

  const smartYield = await deploySmartYield(deployerSign, juniorTokenCONF.name, juniorTokenCONF.symbol, BN.from(decimals));
  const seniorBond = await deploySeniorBond(deployerSign, smartYield.address, seniorBondCONF.name, seniorBondCONF.symbol);
  const juniorBond = await deployJuniorBond(deployerSign, smartYield.address, juniorBondCONF.name, juniorBondCONF.symbol);

  const controller = await deployCompoundController(deployerSign, pool.address, smartYield.address, bondModel.address, uniswapPath);
  const oracle = await deployYieldOracle(deployerSign, controller.address, oracleCONF.windowSize, oracleCONF.granularity);

  await controller.setOracle(oracle.address);
  await controller.setFeesOwner(feesOwner);
  await smartYield.setup(controller.address, pool.address, seniorBond.address, juniorBond.address);
  await pool.setup(smartYield.address, controller.address);

  await controller.setGuardian(dao);
  await controller.setDao(dao);

  console.log('CONF --------');
  console.log('DAO:', dao);
  console.log('cUSDC:', cUSDC);
  console.log('COMP:', COMP);
  console.log('USDC:', USDC);
  console.log('WETH:', WETH);
  console.log('uniswapPath:', uniswapPath);
  console.log('');
  console.log('DEPLOYED ----');
  console.log('bondModel:', bondModel.address);
  console.log('compoundProvider:', pool.address);
  console.log('smartYield:', smartYield.address);
  console.log('seniorBond:', seniorBond.address);
  console.log('juniorBond:', juniorBond.address);
  console.log('controller:', controller.address);
  console.log('oracle:', oracle.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
