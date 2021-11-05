import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-web3';
import 'hardhat-typechain';
import 'hardhat-contract-sizer';
import 'hardhat-abi-exporter';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {

  solidity: {
    version: '0.7.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 9999,
      },
    },
  },
  networks: {
    ropsten: {
      url: `${process.env.INFURA_KEY}`,
      accounts: {
        mnemonic: process.env.MNEMONIC
      },
      chainId: 3,
      gas: 25000000,
      blockGasLimit: 0x1fffffffffffff,
    },
    
    hardhat: {
      forking: {
        url: `${process.env.PROVIDER_FORKING}`,
        blockNumber: 12554401, 
      },
      allowUnlimitedContractSize: true,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      gas: 25000000,
      blockGasLimit: 0x1fffffffffffff,
      chainId: 1,
      gasMultiplier: 1.5,
      gasPrice: 1000000000, 
      
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 1000000
  },
  
  
};

export default config;
