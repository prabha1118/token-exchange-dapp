// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {mETH} from "../src/mETH.sol";

contract DeploymETH is Script {
    address public constant deployer =
        0x69174d50e20a5b60FF0e4455c9d7F52FeE5dF646;
    uint256 public constant INTIAL_SUPPLY = 1000 ether;

    mETH public _mETH;

    function run() external returns (mETH) {
        if (block.chainid == 11155111) {
            vm.startBroadcast(deployer);
            _mETH = new mETH(INTIAL_SUPPLY);
            vm.stopBroadcast();
            return _mETH;
        } else {
            vm.startBroadcast();
            _mETH = new mETH(INTIAL_SUPPLY);
            vm.stopBroadcast();
            return _mETH;
        }
    }
}
