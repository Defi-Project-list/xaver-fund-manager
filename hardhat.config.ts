import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

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
    // ropsten: {
    //   url: `${process.env.INFURA_KEY}`,
    //   accounts: [`${process.env.ROPSTEN_PRIVATE_KEY}`]
    // },
    // coverage: {
    //   forking: {
    //     url: `${process.env.PROVIDER_FORKING}`,
    //     blockNumber: 12525794, 
    //   },
    //   allowUnlimitedContractSize: true,
    //   url: 'http://localhost:8555',
    // },
    
    hardhat: {
      forking: {
        url: `${process.env.PROVIDER_FORKING}`,
        blockNumber: 12525794, 
      },
      allowUnlimitedContractSize: true,
      gas: 1200000000,
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
    timeout: 40000
  },
  
  
};

export default config;
