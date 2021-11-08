import { deployContract } from 'ethereum-waffle';
import { Signer, BigNumberish } from 'ethers';

import SmartYieldArtifact from './../../artifacts/contracts/SmartYield.sol/SmartYield.json';
import { SmartYield } from '@typechain/SmartYield';

import YieldOracleArtifact from './../../artifacts/contracts/oracle/YieldOracle.sol/YieldOracle.json';
import { YieldOracle, YieldOracleInterface } from '@typechain/YieldOracle';

import IYieldOracleArtifact from './../../artifacts/contracts/oracle/IYieldOracle.sol/IYieldOracle.json';
import { IYieldOracle } from '@typechain/IYieldOracle';

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
import { YearnControllerMock } from '@typechain/YearnControllerMock';

import YearnProviderArtifact from './../../artifacts/contracts/providers/YearnProvider.sol/YearnProvider.json';
import { YearnProvider } from '@typechain/YearnProvider';

export const deployYearnProvider = (deployerSign: Signer, yTokenAddress: string , uTokenAddress: string): Promise<YearnProvider> => {
  return (deployContract(deployerSign, YearnProviderArtifact, [yTokenAddress, uTokenAddress])) as Promise<YearnProvider>;
};

export const deployYearnProviderMock = (deployerSign: Signer): Promise<YearnProviderMock> => {
  return (deployContract(deployerSign, YearnProviderMockArtifact, [])) as Promise<YearnProviderMock>;
};

export const deployBondModel = (deployerSign: Signer): Promise<BondModelV1> => {
  return (deployContract(deployerSign, BondModelV1Artifact, [])) as Promise<BondModelV1>;
};

export const deployYearnControllerMock = (deployerSign: Signer, poolAddress: string, bondModelAddress: string, yTokenAddress: string): Promise<YearnControllerMock> => {
  return (deployContract(deployerSign, YearnControllerMockArtifact, [poolAddress, bondModelAddress, yTokenAddress])) as Promise<YearnControllerMock>;
};

export const deployCompoundController = (deployerSign: Signer, poolAddress: string, smartYieldAddress: string, bondModelAddress: string, uniswapPath: string[] = []): Promise<CompoundController> => {
  return (deployContract(deployerSign, CompoundControllerArtifact, [poolAddress, smartYieldAddress, bondModelAddress, uniswapPath])) as Promise<CompoundController>;
};

export const deployCompoundProvider = (deployerSign: Signer, cTokenAddress: string): Promise<CompoundProvider> => {
  return (deployContract(deployerSign, CompoundProviderArtifact, [cTokenAddress])) as Promise<CompoundProvider>;
};

export const deploySeniorBond = (deployerSign: Signer, smartYieldAddress: string, name: string, symbol: string): Promise<SeniorBond> => {
  return (deployContract(deployerSign, SeniorBondArtifact, [smartYieldAddress, name, symbol])) as Promise<SeniorBond>;
};

export const deployJuniorBond = (deployerSign: Signer, smartYieldAddress: string, name: string, symbol: string): Promise<JuniorBond> => {
  return (deployContract(deployerSign, JuniorBondArtifact, [smartYieldAddress, name, symbol])) as Promise<JuniorBond>;
};

export const deploySmartYield = (deployerSign: Signer, name: string, symbol: string, decimals: BigNumberish): Promise<SmartYield> => {
  return (deployContract(deployerSign, SmartYieldArtifact, [name, symbol, decimals])) as Promise<SmartYield>;
};

export const deployYieldOracle = (deployerSign: Signer, cumulativeAddress: string, windowSize: number, granularity: number): Promise<YieldOracle> => {
  return (deployContract(deployerSign, YieldOracleArtifact, [cumulativeAddress, windowSize, granularity])) as Promise<YieldOracle>;
};

export const deployYieldOracleInterface = (deployerSign: Signer): Promise<IYieldOracle> => {
  return (deployContract(deployerSign, IYieldOracleArtifact, [])) as Promise<IYieldOracle>;
};