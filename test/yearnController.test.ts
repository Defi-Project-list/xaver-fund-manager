import { expect } from "chai";
import { Signer, Wallet } from "ethers"
import { ethers, waffle } from "hardhat";
const { time } = require('@openzeppelin/test-helpers');

import { deployYearnControllerMock} from "./helpers/deploy";

import { getUSDCSigner, erc20, formatUSDC, parseUSDC } from './helpers/helpers';

const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';