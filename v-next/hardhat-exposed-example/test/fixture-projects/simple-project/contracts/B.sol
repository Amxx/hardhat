// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { console } from "hardhat/console.sol";
import { A } from "./A.sol";
import { IB, IBB } from "./IB.sol";

contract B is IB {}

contract BB is IBB {}
