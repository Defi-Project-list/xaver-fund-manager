import 'tsconfig-paths/register';

import { Wallet, BigNumber as BN } from 'ethers';
import { run, ethers } from 'hardhat';

const decimals = 6; // same as USDC
const dao = '0xCA11d776673a8058DaFF6fbA16223120af8fF0B2';

// compound ROPSTEN
const cUSDC = '0x2973e69b20563bcc66dc63bde153072c33ef37fe';
const COMP = '0xf76d4a441e4ba86a923ce32b89aff89dbccaa075';

const USDC = '0x07865c6e87b9f70255377e024ace6630c1eaa37f';
const WETH = '0xc778417e063141139fce010982780140aa0cd5ab';

async function main() {

  const [dao, user] = (await ethers.getSigners()) as unknown[] as Wallet[];

  console.log('Dao:', dao.address);
  console.log('user:', user.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
