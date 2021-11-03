import { deployContract } from 'ethereum-waffle';
import { Signer, Wallet, BigNumberish } from 'ethers';

import SmartYieldArtifact from './../../artifacts/contracts/SmartYield.sol/SmartYield.json';
import { SmartYield } from '@typechain/SmartYield';

import YieldOracleArtifact from './../../artifacts/contracts/oracle/YieldOracle.sol/YieldOracle.json';
import { YieldOracle } from '@typechain/YieldOracle';
import { IBondModel } from '@typechain/IBondModel';

import BondModelV1Artifact from './../../artifacts/contracts/model/BondModelV1.sol/BondModelV1.json';
import { BondModelV1 } from '@typechain/BondModelV1';

import CompoundControllerArtifact from './../../artifacts/contracts/providers/CompoundController.sol/CompoundController.json';
import { CompoundController } from '@typechain/CompoundController';

import CompoundProviderArtifact from './../../artifacts/contracts/providers/CompoundProvider.sol/CompoundProvider.json';
import { CompoundProvider } from '@typechain/CompoundProvider';

import JuniorBondArtifact from './../../artifacts/contracts/JuniorBond.sol/JuniorBond.json';
import { JuniorBond } from '@typechain/JuniorBond';

import SeniorBondArtifact from './../../artifacts/contracts/SeniorBond.sol/SeniorBond.json';
import { SeniorBond } from '@typechain/SeniorBond';

import YearnProviderMockArtifact from './../../artifacts/contracts/providers/YearnProviderMock.sol/YearnProviderMock.json';
import { YearnProviderMock } from '@typechain/YearnProviderMock';

import YearnControllerMockArtifact from './../../artifacts/contracts/providers/YearnControllerMock.sol/YearnControllerMock.json';
import { YearnControllerMock } from '@typechain/YearnProviderMock';


export const deployYearnProviderMock = (deployerSign: Wallet): Promise<YearnProviderMock> => {
  return (deployContract(deployerSign, YearnProviderMockArtifact, [])) as Promise<YearnProviderMock>;
};

export const deployYearnControllerMock = (deployerSign: Wallet): Promise<YearnControllerMock> => {
  return (deployContract(deployerSign, YearnControllerMockArtifact, [])) as Promise<YearnControllerMock>;
};

export const deployBondModel = (deployerSign: Wallet): Promise<BondModelV1> => {
  return (deployContract(deployerSign, BondModelV1Artifact, [])) as Promise<BondModelV1>;
};

export const deployCompoundController = (deployerSign: Wallet, poolAddress: string, smartYieldAddress: string, bondModelAddress: string, uniswapPath: string[] = []): Promise<CompoundController> => {
  return (deployContract(deployerSign, CompoundControllerArtifact, [poolAddress, smartYieldAddress, bondModelAddress, uniswapPath])) as Promise<CompoundController>;
};

export const deployCompoundProvider = (deployerSign: Wallet, cTokenAddress: string): Promise<CompoundProvider> => {
  return (deployContract(deployerSign, CompoundProviderArtifact, [cTokenAddress])) as Promise<CompoundProvider>;
};

export const deploySeniorBond = (deployerSign: Wallet, smartYieldAddress: string, name: string, symbol: string): Promise<SeniorBond> => {
  return (deployContract(deployerSign, SeniorBondArtifact, [smartYieldAddress, name, symbol])) as Promise<SeniorBond>;
};

export const deployJuniorBond = (deployerSign: Wallet, smartYieldAddress: string, name: string, symbol: string): Promise<JuniorBond> => {
  return (deployContract(deployerSign, JuniorBondArtifact, [smartYieldAddress, name, symbol])) as Promise<JuniorBond>;
};

export const deploySmartYield = (deployerSign: Wallet, name: string, symbol: string, decimals: BigNumberish): Promise<SmartYield> => {
  return (deployContract(deployerSign, SmartYieldArtifact, [name, symbol, decimals])) as Promise<SmartYield>;
};

export const deployYieldOracle = (deployerSign: Wallet, cumulativeAddress: string, windowSize: number, granularity: number): Promise<YieldOracle> => {
  return (deployContract(deployerSign, YieldOracleArtifact, [cumulativeAddress, windowSize, granularity])) as Promise<YieldOracle>;
};